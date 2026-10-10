"use client";
import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { EffectComposer, Bloom, ToneMapping } from "@react-three/postprocessing";
import { ToneMappingMode, type BloomEffect } from "postprocessing";
import * as THREE from "three";
import { DOT_WORLD, RLetter } from "./RLetter";
import { onScenePause, sceneBridge } from "./SceneBridge";

/** Pointer distance (CSS px) from the projected dot at which the flare starts. */
const FLARE_RADIUS = 160;
/** Vertical FOV across the poster box at rest (camera z 6): defines the letter's on-screen size. */
const BASE_FOV = 35;
const TAN_HALF_BASE = Math.tan(THREE.MathUtils.degToRad(BASE_FOV / 2));

/**
 * Viewport canvas, box framing: renders exactly what a BASE_FOV camera would show inside the poster box (same focal
 * length in CSS px, principal point at the box centre), extended to the whole canvas with an off-centre view offset.
 * `aim` (0..1) slides the principal point to the canvas centre for the dive.
 */
function frameToBox(camera: THREE.PerspectiveCamera, canvas: DOMRect, box: DOMRect, aim: number) {
  const w = canvas.width;
  const h = canvas.height;
  if (!w || !h || !box.height) return;
  const focal = box.height / (2 * TAN_HALF_BASE);
  const px = THREE.MathUtils.lerp(box.left - canvas.left + box.width / 2, w / 2, aim);
  const py = THREE.MathUtils.lerp(box.top - canvas.top + box.height / 2, h / 2, aim);
  // the smallest centred "full view" that contains the canvas with the principal point at its centre
  const fw = 2 * Math.max(px, w - px);
  const fh = 2 * Math.max(py, h - py);
  camera.fov = THREE.MathUtils.radToDeg(2 * Math.atan(fh / (2 * focal)));
  camera.aspect = fw / fh;
  camera.setViewOffset(fw, fh, fw / 2 - px, fh / 2 - py, w, h);
  camera.updateProjectionMatrix();
}

export type Props = {
  onReady: () => void;
  /** Only used by the import-failure fallback in HeroPoster. */
  onFail?: () => void;
  /** false renders without the EffectComposer (fallback when the GPU cannot run the bloom passes). */
  postprocessing?: boolean;
  /** Needed for toDataURL() in the poster renderer. */
  preserveDrawingBuffer?: boolean;
  /** false: canvas exactly fills the box (poster renders). Default: a viewport-sized canvas framed to the box (the dive). */
  viewport?: boolean;
  /** Software rasterizer forced (tests/debug): half resolution, no multisampling, so the CPU-rendered frames stay cheap. */
  lite?: boolean;
};

type ClientPointer = { x: number; y: number; active: boolean };

/**
 * Per-frame driver: camera from the bridge, bloom intensity from the bridge, pointer flare.
 * Owns the EffectComposer so the Bloom ref is local to the component that mutates it.
 */
function Rig({ postprocessing, client, viewport, lite }: { postprocessing: boolean; client: RefObject<ClientPointer>; viewport: boolean; lite: boolean }) {
  const bloom = useRef<BloomEffect>(null);
  const dot = useRef(new THREE.Vector3());
  const gl = useThree((s) => s.gl);
  const rect = useRef<DOMRect | null>(null);
  const boxRect = useRef<DOMRect | null>(null);
  // Cache the canvas and poster-box rects; re-read on resize/scroll instead of every frame.
  useEffect(() => {
    const el = gl.domElement;
    const box = el.closest<HTMLElement>("[data-hero-poster]");
    const read = () => {
      rect.current = el.getBoundingClientRect();
      boxRect.current = box?.getBoundingClientRect() ?? null;
    };
    // scroll fires many times per frame under Lenis: at most one layout read per animation frame
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => { raf = 0; read(); });
    };
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    if (box) ro.observe(box);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", read);
    return () => {
      ro.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", read);
    };
  }, [gl]);
  useFrame((state, dt) => {
    const { camera } = state;
    const { aim, cameraZ } = sceneBridge;
    // approach: the camera slides in front of the dot and looks straight at it (aim 0 = the at-rest framing)
    camera.position.set(DOT_WORLD.x * aim, DOT_WORLD.y * aim, cameraZ);
    camera.lookAt(DOT_WORLD.x * aim, DOT_WORLD.y * aim, 0);
    if (viewport && rect.current && boxRect.current && camera instanceof THREE.PerspectiveCamera) {
      frameToBox(camera, rect.current, boxRect.current, aim);
    }
    if (bloom.current) bloom.current.intensity = sceneBridge.bloom;

    // Flare: +40 % light when the pointer is within FLARE_RADIUS px of the projected dot.
    let target = 0;
    const p = client.current;
    const r = rect.current;
    if (p.active && r) {
      const v = dot.current.set(DOT_WORLD.x, DOT_WORLD.y, 0).project(camera);
      const sx = r.left + ((v.x + 1) / 2) * r.width;
      const sy = r.top + ((1 - v.y) / 2) * r.height;
      target = 1 - THREE.MathUtils.smoothstep(Math.hypot(p.x - sx, p.y - sy), FLARE_RADIUS * 0.5, FLARE_RADIUS);
    }
    sceneBridge.flare = THREE.MathUtils.damp(sceneBridge.flare, target, 8, dt);
  });
  if (!postprocessing) return null;
  return (
    <EffectComposer multisampling={lite ? 0 : 4}>
      <Bloom ref={bloom} mipmapBlur intensity={sceneBridge.bloom} luminanceThreshold={0.8} luminanceSmoothing={0.2} levels={6} />
      <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
    </EffectComposer>
  );
}

/**
 * Compiles the scene's programs with KHR_parallel_shader_compile (non-blocking) before the loop starts,
 * so the first frame does not stall the main thread (and the loader) on synchronous shader linking.
 */
function Warmup({ onWarm }: { onWarm: () => void }) {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  const camera = useThree((s) => s.camera);
  useEffect(() => {
    let alive = true;
    gl.compileAsync(scene, camera)
      .catch(() => undefined)
      .then(() => { if (alive) onWarm(); });
    return () => { alive = false; };
  }, [gl, scene, camera, onWarm]);
  return null;
}

/** Resolves once the first frame has actually been drawn (useFrame runs before the render of its tick). */
function Ready({ onReady }: { onReady: () => void }) {
  const frames = useRef(0);
  const done = useRef(false);
  useFrame(() => {
    if (done.current) return;
    frames.current += 1;
    if (frames.current >= 2) { done.current = true; onReady(); }
  });
  return null;
}

export default function HeroScene({ onReady, postprocessing = true, preserveDrawingBuffer = false, viewport = true, lite = false }: Props) {
  const wrapper = useRef<HTMLDivElement>(null);
  const client = useRef<ClientPointer>({ x: 0, y: 0, active: false });
  const [visible, setVisible] = useState(true);
  // the dive hides the scene past .72 and stops the loop (no GPU work while invisible)
  const [paused, setPaused] = useState(() => sceneBridge.paused);
  useEffect(() => onScenePause(() => setPaused(sceneBridge.paused)), []);
  // ...but always draw the first frames, so readiness (the loader) resolves on a deep link that starts past the dive
  const [drawn, setDrawn] = useState(false);
  const handleReady = useCallback(() => { setDrawn(true); onReady(); }, [onReady]);
  const [warm, setWarm] = useState(false);
  const handleWarm = useCallback(() => setWarm(true), []);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" && e.pointerType !== "pen") return;
      sceneBridge.pointer.x = (e.clientX / innerWidth) * 2 - 1;
      sceneBridge.pointer.y = (e.clientY / innerHeight) * 2 - 1;
      const c = client.current;
      c.x = e.clientX; c.y = e.clientY; c.active = true;
    };
    const onLeave = () => { client.current.active = false; sceneBridge.pointer.x = 0; sceneBridge.pointer.y = 0; };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      sceneBridge.pointer.x = 0;
      sceneBridge.pointer.y = 0;
      sceneBridge.flare = 0;
    };
  }, []);

  // Pause the render loop while the scene is well outside the viewport (box mode; the viewport canvas is fixed
  // and relies on the bridge pause instead).
  useEffect(() => {
    const el = wrapper.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: "50% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    // Viewport-sized (fixed) so the dive can fill the screen and the bloom halo is never clipped; the camera is framed
    // to the poster box (see frameToBox), so at rest the letter sits exactly where the box is. -top-16: the pinned hero
    // (transformed by ScrollTrigger) is the containing block and starts under the navbar; the canvas reaches the top
    // edge behind the navbar glass either way. Never intercepts pointer events.
    <div ref={wrapper} data-hero-scene className={`pointer-events-none ${viewport ? "fixed inset-x-0 -top-16 bottom-0" : "absolute inset-0"}`}>
      <Canvas
        dpr={lite ? 0.5 : [1, 1.5]}
        // near 0.01: the dive ends 0.03 units from the counter's surface
        camera={{ position: [0, 0, 6], fov: BASE_FOV, near: 0.01 }}
        // the EffectComposer multisamples; native MSAA on the default framebuffer would be wasted
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance", preserveDrawingBuffer }}
        frameloop={warm && visible && (!paused || !drawn) ? "always" : "never"}
        style={{ pointerEvents: "none" }}
        aria-hidden
      >
        {/* Procedural studio environment (no network) for the brushed metal: a cool softbox upper left, a cool strip
            behind right, a dim cool card in front, and a small red ring at the counter so the face reflects the signal. Hardware GL only (software
            renderers get the poster). */}
        <Environment resolution={64} frames={1}>
          <Lightformer form="rect" color="#B8C4FF" intensity={1.6} position={[-4, 4, 3]} scale={[5, 1.5, 1]} target={[0, 0, 0]} />
          <Lightformer form="rect" color="#8FA2E0" intensity={0.7} position={[4, -1, -3]} scale={[2, 6, 1]} target={[0, 0, 0]} />
          {/* a dim cool card straight in front: the flat face mirrors +z, so this sets the metal's base sheen */}
          <Lightformer form="rect" color="#B4B8C8" intensity={1.4} position={[0, 0, 4]} scale={[7, 7, 1]} target={[0, 0, 0]} />
          {/* the face mirrors +z, so the ring is kept small and dim: red stays light, never a fill */}
          <Lightformer form="ring" color="#FF4A26" intensity={0.9} position={[-0.13, 0.58, 2.5]} scale={0.6} target={[0, 0, 0]} />
        </Environment>
        <ambientLight intensity={0.05} color="#9DB2FF" />
        <directionalLight position={[-4, 5, 6]} intensity={0.8} color="#B8C4FF" />
        <directionalLight position={[2, 3, -4]} intensity={2.5} color="#8FA2E0" />
        <RLetter />
        <Rig postprocessing={postprocessing} client={client} viewport={viewport} lite={lite} />
        <Warmup onWarm={handleWarm} />
        <Ready onReady={handleReady} />
      </Canvas>
    </div>
  );
}
