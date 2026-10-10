"use client";
import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom, ToneMapping } from "@react-three/postprocessing";
import { ToneMappingMode, type BloomEffect } from "postprocessing";
import * as THREE from "three";
import { DOT_WORLD, RLetter } from "./RLetter";
import { sceneBridge } from "./SceneBridge";

/** Pointer distance (CSS px) from the projected dot at which the flare starts. */
const FLARE_RADIUS = 160;

type Props = {
  onReady: () => void;
  /** false renders without the EffectComposer (fallback when the GPU cannot run the bloom passes). */
  postprocessing?: boolean;
  /** Needed for toDataURL() in the poster renderer. */
  preserveDrawingBuffer?: boolean;
};

type ClientPointer = { x: number; y: number; active: boolean };

/**
 * Per-frame driver: camera from the bridge, bloom intensity from the bridge, pointer flare.
 * Owns the EffectComposer so the Bloom ref is local to the component that mutates it.
 */
function Rig({ postprocessing, client }: { postprocessing: boolean; client: RefObject<ClientPointer> }) {
  const bloom = useRef<BloomEffect>(null);
  const dot = useRef(new THREE.Vector3());
  useFrame((state, dt) => {
    const { camera, gl } = state;
    const { progress, cameraZ } = sceneBridge;
    camera.position.z = cameraZ;
    camera.lookAt(DOT_WORLD.x * progress, DOT_WORLD.y * progress, 0);
    if (bloom.current) bloom.current.intensity = sceneBridge.bloom;

    // Flare: +40 % light when the pointer is within FLARE_RADIUS px of the projected dot.
    let target = 0;
    const p = client.current;
    if (p.active) {
      const rect = gl.domElement.getBoundingClientRect();
      const v = dot.current.set(DOT_WORLD.x, DOT_WORLD.y, 0).project(camera);
      const sx = rect.left + ((v.x + 1) / 2) * rect.width;
      const sy = rect.top + ((1 - v.y) / 2) * rect.height;
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

export default function HeroScene({ onReady, postprocessing = true, preserveDrawingBuffer = false }: Props) {
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
      client.current = { x: e.clientX, y: e.clientY, active: true };
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
    <div ref={wrapper} data-hero-scene className="absolute inset-0">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 6], fov: 35 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance", preserveDrawingBuffer }}
        frameloop={warm && visible ? "always" : "never"}
        aria-hidden
      >
        {/* Cool fill from the upper left plus a faint rim from behind: the dark metal keeps its silhouette.
            (No runtime environment map: a PMREM bake blocks the main thread on slow GPUs.) */}
        <ambientLight intensity={0.08} color="#9DB2FF" />
        <directionalLight position={[-4, 5, 6]} intensity={2.4} color="#B8C4FF" />
        <directionalLight position={[3, -2, -5]} intensity={1.2} color="#8FA2E0" />
        <pointLight position={[-2.2, 2.4, 2.6]} intensity={9} distance={12} decay={2} color="#AEB9E8" />
        <RLetter />
        <Rig postprocessing={postprocessing} client={client} />
        <Warmup onWarm={handleWarm} />
        <Ready onReady={onReady} />
      </Canvas>
    </div>
  );
}
