import localFont from "next/font/local";

// Spec §10: preload only the two faces the first paint needs (Cabinet 800 for the display type, Switzer 400 for body).
// The other weights join the same font-family (shared `font-family` declaration, literal values only: next/font
// options are statically analysed) without a preload and swap in.

export const display = localFont({
  src: [{ path: "../public/fonts/cabinet-grotesk-800.woff2", weight: "800" }],
  declarations: [{ prop: "font-family", value: "Cabinet Grotesk" }],
  variable: "--font-display-face",
  display: "swap",
  preload: true,
});

const displayRest = localFont({
  src: [{ path: "../public/fonts/cabinet-grotesk-700.woff2", weight: "700" }],
  declarations: [{ prop: "font-family", value: "Cabinet Grotesk" }],
  display: "swap",
  preload: false,
  adjustFontFallback: false,
});

export const body = localFont({
  src: [{ path: "../public/fonts/switzer-400.woff2", weight: "400" }],
  declarations: [{ prop: "font-family", value: "Switzer" }],
  variable: "--font-body-face",
  display: "swap",
  preload: true,
});

const bodyRest = localFont({
  src: [
    { path: "../public/fonts/switzer-500.woff2", weight: "500" },
    { path: "../public/fonts/switzer-600.woff2", weight: "600" },
  ],
  declarations: [{ prop: "font-family", value: "Switzer" }],
  display: "swap",
  preload: false,
  adjustFontFallback: false,
});

export const mono = localFont({
  src: [
    { path: "../public/fonts/ibm-plex-mono-400.woff2", weight: "400" },
    { path: "../public/fonts/ibm-plex-mono-500.woff2", weight: "500" },
  ],
  variable: "--font-mono-face",
  display: "swap",
  preload: false,
  // no Arial-based metric fallback: the stack's monospace fallbacks (ui-monospace, Menlo, monospace) share Plex Mono's
  // 0.6 em advance, so mono lines (eyebrows, the availability badge) wrap the same before and after the swap (CLS)
  adjustFontFallback: false,
});

/** Referenced so the non-preloaded faces' @font-face rules are emitted (their class names are never applied). */
export const extraFaces = [displayRest.style.fontFamily, bodyRest.style.fontFamily];
