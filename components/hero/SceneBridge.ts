/**
 * Mutable bridge between DOM-side motion (pointer, Task 6 scroll timeline) and the R3F scene.
 * Read every frame by the scene; never triggers React renders. Must stay free of `three` imports.
 */
export const sceneBridge = {
  progress: 0, // 0..1 dive progress from scroll
  pointer: { x: 0, y: 0 }, // -1..1
  flare: 0, // 0..1 pointer-near-dot boost
  intensity: 1, // light multiplier
  bloom: 1.2,
  cameraZ: 6,
};

export type SceneBridge = typeof sceneBridge;
