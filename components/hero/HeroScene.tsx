"use client";
import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { EffectComposer, Bloom, ToneMapping } from "@react-three/postprocessing";
import { ToneMappingMode, type BloomEffect } from "postprocessing";
import * as THREE from "three";
import { DOT_WORLD, RLetter } from "./RLetter";
import { sceneBridge } from "./SceneBridge";

/** Pointer distance (CSS px) from the projected dot at which the flare starts. */
const FLARE_RADIUS = 160;
/** Canvas bleed beyond the poster box on each side (fraction of the box), so the bloom halo is never clipped. */
const BLEED = 0.25;
const BASE_FOV = 35;
/** Same on-screen letter size in a canvas (1 + 2·BLEED)× larger than the box. */
const BLEED_FOV = THREE.MathUtils.radToDeg(2 * Math.atan((1 + 2 * BLEED) * Math.tan(THREE.MathUtils.degToRad(BASE_FOV / 2))));

export type Props = {
  onReady: () => void;
  /** Only used by the import-failure fallback in HeroPoster. */
  onFail?: () => void;
  /** false renders without the EffectComposer (fallback when the GPU cannot run the bloom passes). */
  postprocessing?: boolean;
  /** Needed for toDataURL() in the poster renderer. */
  preserveDrawingBuffer?: boolean;
  /** false: canvas exactly fills the box (poster renders). Default: bleed past the box so bloom is not clipped. */
  bleed?: boolean;
};

type ClientPointer = { x: number; y: number; active: boolean };

/**
 * Per-frame driver: camera from the bridge, bloom intensity from the bridge, pointer flare.
 * Owns the EffectComposer so the Bloom ref is local to the component that mutates it.
 */
function Rig({ postprocessing, client }: { postprocessing: boolean; client: RefObject<ClientPointer> }) {
  const bloom = useRef<BloomEffect>(null);
  const dot = useRef(new THREE.Vector3());
  const gl = useThree((s) => s.gl);
  const rect = useRef<DOMRect | null>(null);
  // Cache the canvas rect; re-read on resize/scroll instead of every frame.
  useEffect(() => {
    const el = gl.domElement;
    const read = () => { rect.current = el.getBoundingClientRect(); };
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    window.addEventListener("scroll", read, { passive: true });
    window.addEventListener("resize", read);
    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", read);
      window.removeEventListener("resize", read);
    };
  }, [gl]);
  useFrame((state, dt) => {
    const { camera } = state;
    const { progress, cameraZ } = sceneBridge;
    camera.position.z = cameraZ;
    camera.lookAt(DOT_WORLD.x * progress, DOT_WORLD.y * progress, 0);
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
    <EffectComposer multisampling={4}>
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

export default function HeroScene({ onReady, postprocessing = true, preserveDrawingBuffer = false, bleed = true }: Props) {
  const wrapper = useRef<HTMLDivElement>(null);
  const client = useRef<ClientPointer>({ x: 0, y: 0, active: false });
  const [visible, setVisible] = useState(true);
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

  // Pause the render loop while the scene is well outside the viewport.
  useEffect(() => {
    const el = wrapper.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: "50% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    // The bleed wrapper extends past the poster box so the bloom halo fades out instead of being clipped into a square.
    // Task 6 makes the canvas viewport-sized for the dive anyway. Never intercepts pointer events.
    <div ref={wrapper} data-hero-scene className={`pointer-events-none absolute ${bleed ? "inset-[-25%]" : "inset-0"}`}>
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 6], fov: bleed ? BLEED_FOV : BASE_FOV }}
        // the EffectComposer multisamples; native MSAA on the default framebuffer would be wasted
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance", preserveDrawingBuffer }}
        frameloop={warm && visible ? "always" : "never"}
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
        <Rig postprocessing={postprocessing} client={client} />
        <Warmup onWarm={handleWarm} />
        <Ready onReady={onReady} />
      </Canvas>
    </div>
  );
}
