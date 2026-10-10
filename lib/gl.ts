"use client";

export type GLCapability = { capable: boolean; software: boolean };

let cached: GLCapability | null = null;

type Probe = { gl: WebGLRenderingContext | WebGL2RenderingContext | null; webgl2: boolean; renderer: string };
let probe: Probe | null = null;

/**
 * The page's single probing WebGL context, shared by tier detection (lib/tiers), detect-gpu and glCapability().
 * Creating a context is a long main-thread task (it can start the GPU process), so the page creates one, not three.
 * Released by releaseProbe() once tier detection is done; the cached results stay.
 */
export function probeGL(): Probe {
  if (probe) return probe;
  let gl: Probe["gl"] = null;
  let webgl2 = false;
  let renderer = "";
  try {
    const c = document.createElement("canvas");
    gl = c.getContext("webgl2");
    webgl2 = !!gl;
    gl ??= c.getContext("webgl");
    const info = gl?.getExtension("WEBGL_debug_renderer_info");
    if (gl && info) renderer = String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL));
  } catch { gl = null; }
  return (probe = { gl, webgl2, renderer });
}

/** Frees the probing context (the scene and shader frames create their own). */
export function releaseProbe(): void {
  if (!probe?.gl) return;
  probe.gl.getExtension("WEBGL_lose_context")?.loseContext();
  probe.gl = null;
}

/**
 * Whether three/R3F may mount: WebGL2 on a hardware rasterizer. Software rasterizers (SwiftShader, llvmpipe, WARP)
 * link shaders synchronously for seconds and freeze the page (spec §6.4: GPU tier 0 is never a scene tier); real tier
 * detection already rules them out, this covers the `redzy:tier` override. three 0.186 needs WebGL2.
 * `localStorage["redzy:scene"] = "force"` allows a software renderer anyway (tests/debug); `software` then tells the
 * caller to render lighter (half resolution).
 */
export function glCapability(): GLCapability {
  if (cached) return cached;
  try {
    const { webgl2, renderer } = probeGL();
    releaseProbe();
    if (!webgl2) return (cached = { capable: false, software: false });
    let forced = false;
    try { forced = localStorage.getItem("redzy:scene") === "force"; } catch {}
    const software = /swiftshader|llvmpipe|softpipe|software|basic render/i.test(renderer);
    return (cached = { capable: forced || !software, software: forced && software });
  } catch {
    return { capable: false, software: false };
  }
}
