"use client";
import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import { MONOGRAM } from "@/components/brand/Monogram";
import { sceneBridge } from "./SceneBridge";

/**
 * One unioned outline for stem + bowl + leg (so the bevels never interpenetrate at the joints), plus the counter as an
 * evenodd hole. Derived from MONOGRAM: the leg's right edge leaves the bowl where it crosses the bowl's outer arc,
 * its left edge enters the bowl's bottom edge.
 */
function rOutline(): string {
  const { stem, leg } = MONOGRAM;
  const [, [x2, y2], [x3, y3], [x4, y4]] = leg.split(" ").map((p) => p.split(",").map(Number));
  const cx = 52, cy = 32, r = 22, top = stem.y, bottom = cy + r; // bowl circle (from MONOGRAM.bowl)
  const left = stem.x, inner = stem.x + stem.width, foot = stem.y + stem.height;
  // leg right edge (x2,y2)->(x3,y3) ∩ bowl circle
  const dx = (x3 - x2) / (y3 - y2);
  const ox = x2 - cx, oy = y2 - cy;
  const qa = dx * dx + 1, qb = 2 * (ox * dx + oy), qc = ox * ox + oy * oy - r * r;
  const t = (-qb + Math.sqrt(qb * qb - 4 * qa * qc)) / (2 * qa);
  const ex = x2 + dx * t, ey = y2 + t;
  // leg left edge (x4,y4)->(leg[0]) ∩ bowl bottom (y = bottom)
  const [x1, y1] = leg.split(" ")[0].split(",").map(Number);
  const lx = x1 + ((x4 - x1) / (y4 - y1)) * (bottom - y1);
  const f = (n: number) => n.toFixed(3);
  return [
    `M${left},${top} H${cx} A${r},${r} 0 0 1 ${f(ex)},${f(ey)} L${x3},${y3} L${x4},${y4} L${f(lx)},${bottom} H${inner} V${foot} H${left} Z`,
    "M30,24 H52 A8,8 0 0 1 52,40 H30 Z", // counter (hole), as in MONOGRAM.bowl
  ].join(" ");
}

const SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path fill-rule="evenodd" d="${rOutline()}"/></svg>`;

/** Fine horizontal brushing as a tiny generated normal map (no network). */
function brushedNormalMap(): THREE.DataTexture {
  const size = 256;
  const data = new Uint8Array(size * size * 4);
  let seed = 0x5eed; // deterministic, so re-rendered posters match
  const rand = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
  for (let y = 0; y < size; y++) {
    const r = 128 + Math.round(rand() * 24 - 12);
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4;
      data[i] = r; data[i + 1] = 128; data[i + 2] = 255; data[i + 3] = 255;
    }
  }
  const tex = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(0.03, 0.03); // extrude UVs are in SVG units
  tex.needsUpdate = true;
  return tex;
}

/** SVG units → world units (100 SVG units = 3.2 world units: the R fills ~70 % of the frame at camera z 6, fov 35). */
export const SCALE = 0.032;
/** The counter (signal dot) in world space, relative to the SVG viewBox centre (50, 50). */
export const DOT_WORLD = { x: (MONOGRAM.dot.cx - 50) * SCALE, y: -(MONOGRAM.dot.cy - 50) * SCALE };

/** Dot radius in SVG units (matches the SVG monogram). */
const MONOGRAM_DOT_R = 5;
const BREATH_PERIOD_MS = 4000;
const BASE_LIGHT = 10;
const CORE_EMISSIVE = 2.4;

export function RLetter() {
  const group = useRef<THREE.Group>(null);
  const light = useRef<THREE.PointLight>(null);
  const core = useRef<THREE.MeshStandardMaterial>(null);
  const geometry = useMemo(() => {
    const data = new SVGLoader().parse(SVG);
    // toShapes() honours the parsed fill-rule (userData.style.fillRule = evenodd), so the counter stays a hole
    const shapes = data.paths.flatMap((p) => p.toShapes());
    const geo = new THREE.ExtrudeGeometry(shapes, { depth: 12, bevelEnabled: true, bevelThickness: 2, bevelSize: 1.2, bevelSegments: 6, curveSegments: 24 });
    // Centre on the viewBox centre (not the bbox) so the dot maps exactly to DOT_WORLD.
    geo.translate(-50, -50, -6); // depth 12 → z symmetric
    // SVG y is down: mirror y. Mirroring z too keeps the determinant positive, so triangle winding
    // and the extruder's smooth bevel normals stay valid (the extrusion is symmetric in z after the translate).
    geo.scale(SCALE, -SCALE, -SCALE);
    return geo;
  }, []);
  const normalMap = useMemo(() => brushedNormalMap(), []);
  const normalScale = useMemo(() => new THREE.Vector2(0.12, 0.12), []);
  useEffect(() => () => { geometry.dispose(); normalMap.dispose(); }, [geometry, normalMap]);
  const dot = useMemo(() => new THREE.Vector3(DOT_WORLD.x, DOT_WORLD.y, 0), []);

  useFrame((_, dt) => {
    if (!group.current || !light.current) return;
    const { pointer, flare, intensity, aim } = sceneBridge;
    // the pointer tilt settles to 0 during the dive's approach
    const settle = 1 - aim;
    const tiltX = THREE.MathUtils.degToRad(8 * pointer.y) * settle;
    const tiltY = THREE.MathUtils.degToRad(8 * pointer.x) * settle;
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, tiltX, 4, dt);
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, tiltY, 4, dt);
    const breathe = 1 + 0.1 * Math.sin((performance.now() / BREATH_PERIOD_MS) * Math.PI * 2);
    light.current.intensity = BASE_LIGHT * intensity * breathe * (1 + 0.4 * flare);
    light.current.position.z = sceneBridge.lightZ;
    if (core.current) core.current.emissiveIntensity = CORE_EMISSIVE * sceneBridge.core;
  });

  return (
    <group ref={group}>
      <mesh geometry={geometry}>
        <meshPhysicalMaterial
          color="#3B3732"
          metalness={1}
          roughness={0.34}
          anisotropy={0.75}
          anisotropyRotation={Math.PI / 2}
          clearcoat={0.3}
          clearcoatRoughness={0.22}
          envMapIntensity={1}
          normalMap={normalMap}
          normalScale={normalScale}
        />
      </mesh>
      {/* key light just in front of the counter (grazing): rakes the bowl's inner walls and spills onto the face */}
      <pointLight ref={light} position={[dot.x, dot.y, 0.4]} color="#FF4A26" intensity={BASE_LIGHT} distance={7} decay={2} />
      <mesh position={dot}>
        {/* finely tessellated: the dive ends a few hundredths of a unit from its surface */}
        <sphereGeometry args={[MONOGRAM_DOT_R * SCALE, 64, 48]} />
        <meshStandardMaterial ref={core} color="#FF4A26" emissive="#FF4A26" emissiveIntensity={CORE_EMISSIVE} toneMapped={false} />
      </mesh>
    </group>
  );
}
