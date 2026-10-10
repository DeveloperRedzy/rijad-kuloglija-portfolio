"use client";

export type GLCapability = { capable: boolean; software: boolean };

let cached: GLCapability | null = null;

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
    const gl = document.createElement("canvas").getContext("webgl2");
    if (!gl) return (cached = { capable: false, software: false });
    const info = gl.getExtension("WEBGL_debug_renderer_info");
    const renderer = info ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)) : "";
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    let forced = false;
    try { forced = localStorage.getItem("redzy:scene") === "force"; } catch {}
    const software = /swiftshader|llvmpipe|softpipe|software|basic render/i.test(renderer);
    return (cached = { capable: forced || !software, software: forced && software });
  } catch {
    return { capable: false, software: false };
  }
}
