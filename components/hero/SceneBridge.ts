/**
 * Mutable bridge between DOM-side motion (pointer, the scroll dive) and the R3F scene.
 * Read every frame by the scene; never triggers React renders (except the pause flag, via its listener).
 * Must stay free of `three` imports.
 */
export const sceneBridge = {
  aim: 0, // 0..1 approach: camera slides in front of the dot, the principal point moves to the viewport centre, tilt settles
  pointer: { x: 0, y: 0 }, // -1..1
  flare: 0, // 0..1 pointer-near-dot boost
  intensity: 1, // light multiplier
  bloom: 1.2,
  core: 1, // counter emissive multiplier: < 1 during the dive so the filled screen reads red, not blown-out white
  lightZ: 0.4, // key light z (in front of the counter at rest); the dive sinks it into the counter, so the sphere glows by its own red
  cameraZ: 6,
  paused: false, // true while the scene is invisible (dive past .72): the render loop stops
  /** Requests one frame (the scene renders on demand); set by the mounted scene, undefined otherwise. */
  invalidate: undefined as (() => void) | undefined,
};

export type SceneBridge = typeof sceneBridge;

const pauseListeners = new Set<() => void>();

/** Stops/resumes the R3F loop; no-op when unchanged. */
export function setScenePaused(paused: boolean): void {
  if (sceneBridge.paused === paused) return;
  sceneBridge.paused = paused;
  pauseListeners.forEach((l) => l());
}

export function onScenePause(listener: () => void): () => void {
  pauseListeners.add(listener);
  return () => { pauseListeners.delete(listener); };
}
