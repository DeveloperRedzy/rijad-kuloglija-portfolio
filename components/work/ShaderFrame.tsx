"use client";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { invalidate, useFrame, useLoader, useThree } from "@react-three/fiber";
import { View, useTexture } from "@react-three/drei";
import { gsap } from "@/lib/gsap";
import { vertex, fragment } from "./frameShader";

type PlaneProps = { src: string; host: HTMLElement; box: HTMLElement; onActive: (active: boolean) => void };

/** Matches the <img> `rounded-md` corners. */
const RADIUS = 6;
const DURATION = 1.2;
const FADE = 0.12;

function makeUniforms() {
  return {
    uMap: { value: null as THREE.Texture | null },
    uProgress: { value: 0 },
    uSweep: { value: 0 },
    uTime: { value: 0 },
    uAlpha: { value: 0 },
    uSize: { value: new THREE.Vector2(1, 1) },
    uRadius: { value: RADIUS },
  };
}
type Uniforms = ReturnType<typeof makeUniforms>;

function Plane({ src, host, box, onActive }: PlaneProps) {
  // Same pixels as the <img>: sRGB in, sRGB out (colorspace_fragment), no tone mapping (`flat` canvas, toneMapped off).
  const tex = useTexture(src, (t) => { t.colorSpace = THREE.SRGBColorSpace; });
  const { gl, scene, camera } = useThree();
  const mat = useRef<THREE.ShaderMaterial>(null);
  const initial = useMemo(() => makeUniforms(), []);

  useEffect(() => {
    const m = mat.current;
    if (!m) return;
    const u = m.uniforms as Uniforms;
    u.uMap.value = tex;
    // Upload the texture and link the program now, so the first hover does not hitch.
    gl.initTexture(tex);
    gl.compile(scene, camera);
    host.setAttribute("data-shader-frame", "ready");
    const ctx = gsap.context(() => {});
    let tl: gsap.core.Timeline | null = null;
    const stop = () => {
      host.removeAttribute("data-shader-active");
      onActive(false);
      invalidate();
    };
    const enter = () => {
      ctx.add(() => {
        tl?.kill();
        const r = box.getBoundingClientRect();
        u.uSize.value.set(r.width, r.height);
        host.setAttribute("data-shader-active", "true");
        onActive(true);
        tl = gsap.timeline({ onUpdate: () => invalidate(), onComplete: stop })
          .fromTo(u.uAlpha, { value: 0 }, { value: 1, duration: FADE, ease: "none" }, 0)
          .fromTo(u.uProgress, { value: 0 }, { value: 1, duration: DURATION, ease: "power2.out" }, 0)
          .fromTo(u.uSweep, { value: 0 }, { value: 1, duration: DURATION, ease: "power2.inOut" }, 0)
          .to(u.uAlpha, { value: 0, duration: FADE, ease: "none" }, DURATION - FADE);
      });
    };
    host.addEventListener("pointerenter", enter);
    return () => {
      host.removeEventListener("pointerenter", enter);
      ctx.revert();
      host.removeAttribute("data-shader-frame");
      host.removeAttribute("data-shader-active");
    };
  }, [gl, scene, camera, tex, host, box, onActive]);

  // Free the GPU texture and drop the loader cache entry (a later mount reloads it from the HTTP cache). R3F disposes
  // the geometry and material on unmount.
  useEffect(() => () => {
    tex.dispose();
    useLoader.clear(THREE.TextureLoader, src);
  }, [tex, src]);

  // Only runs on rendered (invalidated) frames.
  useFrame((_, dt) => {
    const m = mat.current;
    if (m) (m.uniforms as Uniforms).uTime.value += Math.min(dt, 0.05);
  });

  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial ref={mat} uniforms={initial} vertexShader={vertex} fragmentShader={fragment} transparent depthTest={false} depthWrite={false} toneMapped={false} />
    </mesh>
  );
}

/**
 * The shader plane of one frame. drei's View renders a div (absolute, over the <img> box) and draws into the shared
 * FrameCanvas within that div's rect. It only renders while a hover tween runs; at rest the View is not drawn at all,
 * so the plain <img> is what you see.
 */
export default function ShaderFrame({ src, host }: { src: string; host: HTMLElement }) {
  const [active, setActive] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const [boxEl, setBoxEl] = useState<HTMLDivElement | null>(null);
  useEffect(() => { setBoxEl(box.current); }, []);
  return (
    <View ref={box} visible={active} data-shader-view="" className="pointer-events-none absolute inset-0">
      {boxEl && (
        <Suspense fallback={null}>
          <Plane src={src} host={host} box={boxEl} onActive={setActive} />
        </Suspense>
      )}
    </View>
  );
}
