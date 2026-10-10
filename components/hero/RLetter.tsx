"use client";
import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import { MONOGRAM } from "@/components/brand/Monogram";
import { sceneBridge } from "./SceneBridge";

// Geometry-only SVG (no dot). The bowl is evenodd so its inner sub-path becomes a hole (the counter).
const SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect x="${MONOGRAM.stem.x}" y="${MONOGRAM.stem.y}" width="${MONOGRAM.stem.width}" height="${MONOGRAM.stem.height}"/><path fill-rule="evenodd" d="${MONOGRAM.bowl}"/><polygon points="${MONOGRAM.leg}"/></svg>`;

/** SVG units → world units (100 SVG units = 3.2 world units: the R fills ~70 % of the frame at camera z 6, fov 35). */
export const SCALE = 0.032;
/** The counter (signal dot) in world space, relative to the SVG viewBox centre (50, 50). */
export const DOT_WORLD = { x: (MONOGRAM.dot.cx - 50) * SCALE, y: -(MONOGRAM.dot.cy - 50) * SCALE };

/** Dot radius in SVG units (matches the SVG monogram). */
const MONOGRAM_DOT_R = 5;
const BREATH_PERIOD_MS = 4000;
const BASE_LIGHT = 14;

export function RLetter() {
  const group = useRef<THREE.Group>(null);
  const light = useRef<THREE.PointLight>(null);
  const geometry = useMemo(() => {
    const data = new SVGLoader().parse(SVG);
    const shapes = data.paths.flatMap((p) => SVGLoader.createShapes(p));
    const geo = new THREE.ExtrudeGeometry(shapes, { depth: 12, bevelEnabled: true, bevelThickness: 1.2, bevelSize: 1.2, bevelSegments: 3, curveSegments: 24 });
    // Centre on the viewBox centre (not the bbox) so the dot maps exactly to DOT_WORLD.
    geo.translate(-50, -50, -6);
    // SVG y is down: mirror y. Mirroring z too keeps the determinant positive, so triangle winding
    // and the extruder's smooth bevel normals stay valid (the extrusion is symmetric in z after the translate).
    geo.scale(SCALE, -SCALE, -SCALE);
    return geo;
  }, []);
  useEffect(() => () => geometry.dispose(), [geometry]);
  const dot = useMemo(() => new THREE.Vector3(DOT_WORLD.x, DOT_WORLD.y, 0), []);

  useFrame((_, dt) => {
    if (!group.current || !light.current) return;
    const { pointer, flare, intensity, progress } = sceneBridge;
    const settle = 1 - progress;
    const tiltX = THREE.MathUtils.degToRad(8 * pointer.y) * settle;
    const tiltY = THREE.MathUtils.degToRad(8 * pointer.x) * settle;
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, tiltX, 4, dt);
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, tiltY, 4, dt);
    const breathe = 1 + 0.1 * Math.sin((performance.now() / BREATH_PERIOD_MS) * Math.PI * 2);
    light.current.intensity = BASE_LIGHT * intensity * breathe * (1 + 0.4 * flare);
  });

  return (
    <group ref={group}>
      <mesh geometry={geometry}>
        <meshPhysicalMaterial color="#1C1A18" metalness={0.85} roughness={0.38} clearcoat={0.2} clearcoatRoughness={0.4} />
      </mesh>
      {/* key light sits in front of the counter: it rakes the bowl's inner walls and spills onto the face */}
      <pointLight ref={light} position={[dot.x, dot.y, 0.7]} color="#FF4A26" intensity={BASE_LIGHT} distance={9} decay={2} />
      <mesh position={dot}>
        <sphereGeometry args={[MONOGRAM_DOT_R * SCALE, 24, 24]} />
        <meshStandardMaterial color="#FF4A26" emissive="#FF4A26" emissiveIntensity={2.4} toneMapped={false} />
      </mesh>
    </group>
  );
}
