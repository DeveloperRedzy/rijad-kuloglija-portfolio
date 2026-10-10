// Shader for the case-study frame hover (spec §15.8). The quad covers the drei View viewport exactly (no camera), so
// the plane lands on the tracked <img> box pixel for pixel. At rest the View is not rendered at all.
export const vertex = /* glsl */ `
varying vec2 vUv;
void main() { vUv = uv; gl_Position = vec4(position.xy * 2.0, 0.0, 1.0); }
`;

export const fragment = /* glsl */ `
uniform sampler2D uMap;
uniform float uProgress;  // 0..1 ripple
uniform float uSweep;     // 0..1 light band position, top to bottom like the CSS sweep
uniform float uTime;
uniform float uAlpha;     // fade in/out of the whole plane
uniform vec2 uSize;       // plane size in CSS px
uniform float uRadius;    // corner radius in CSS px (matches the <img> rounded-md)
varying vec2 vUv;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
}

void main() {
  float n = noise(vUv * 6.0 + uTime * 0.15);
  float ripple = sin((vUv.y - uProgress) * 24.0) * 0.5 + 0.5;
  float strength = uProgress * (1.0 - uProgress) * 4.0; // peaks mid-way, zero at rest and at the end
  vec2 offset = (n - 0.5) * 0.03 * strength + vec2(0.0, ripple * 0.012 * strength);
  vec4 col = texture2D(uMap, clamp(vUv + offset, 0.0, 1.0));
  float y = 1.0 - vUv.y;
  float band = smoothstep(0.0, 0.18, 1.0 - abs(y - (uSweep * 1.4 - 0.2)) / 0.18);
  // rounded-rect mask in px so the plane never shows square corners over the rounded image
  vec2 q = abs(vUv - 0.5) * uSize - (0.5 * uSize - uRadius);
  float d = length(max(q, 0.0)) - uRadius;
  float mask = 1.0 - smoothstep(-0.5, 0.5, d);
  gl_FragColor = vec4(col.rgb, col.a * mask * uAlpha);
  #include <colorspace_fragment>
  // the band is light added on top in display space (same tint and strength as the CSS sweep)
  gl_FragColor.rgb += vec3(1.0, 0.29, 0.15) * band * 0.22;
}
`;
