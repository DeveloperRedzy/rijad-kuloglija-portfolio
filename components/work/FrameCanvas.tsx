"use client";
import { Canvas } from "@react-three/fiber";
import { View } from "@react-three/drei";

/**
 * The single WebGL context of a case page (spec §15.8): a fixed, transparent, click-through canvas that every
 * ShaderFrame draws into through a drei View. `frameloop="demand"`: it renders only while a hover tween invalidates,
 * so at rest it costs nothing. Lazy (ShaderGate) and Tier A + hardware GL only.
 */
export default function FrameCanvas({ lite }: { lite: boolean }) {
  return (
    <Canvas
      data-frame-canvas=""
      frameloop="demand"
      // software renderer forced for tests: half resolution, like the hero
      dpr={lite ? 0.5 : [1, 1.5]}
      flat
      gl={{ alpha: true, antialias: false, powerPreference: "low-power" }}
      style={{ position: "fixed", inset: 0, width: "100vw", height: "100vh", zIndex: 35, pointerEvents: "none" }}
    >
      <View.Port />
    </Canvas>
  );
}
