import localFont from "next/font/local";

// Spec §10: preload only the two faces the first paint needs (Cabinet 800 for the display type, Switzer 400 for body).
// The other weights join the same font-family (shared `font-family` declaration, literal values only: next/font
// options are statically analysed) without a preload and swap in.

export const display = localFont({
  src: [{ path: "../assets/fonts/cabinet-grotesk-800.woff2", weight: "800" }],
  declarations: [{ prop: "font-family", value: "Cabinet Grotesk" }],
  variable: "--font-display-face",
  display: "swap",
  preload: true,
});

const displayRest = localFont({
  src: [{ path: "../assets/fonts/cabinet-grotesk-700.woff2", weight: "700" }],
  declarations: [{ prop: "font-family", value: "Cabinet Grotesk" }],
  display: "swap",
  preload: false,
  adjustFontFallback: false,
});

export const body = localFont({
  src: [{ path: "../assets/fonts/switzer-400.woff2", weight: "400" }],
  declarations: [{ prop: "font-family", value: "Switzer" }],
  variable: "--font-body-face",
  display: "swap",
  preload: true,
});

const bodyRest = localFont({
  src: [
    { path: "../assets/fonts/switzer-500.woff2", weight: "500" },
    { path: "../assets/fonts/switzer-600.woff2", weight: "600" },
  ],
  declarations: [{ prop: "font-family", value: "Switzer" }],
  display: "swap",
  preload: false,
  adjustFontFallback: false,
});

export const mono = localFont({
  src: [
    { path: "../assets/fonts/ibm-plex-mono-400.woff2", weight: "400" },
    { path: "../assets/fonts/ibm-plex-mono-500.woff2", weight: "500" },
  ],
  // Google's latin block; the latin-ext faces below cover the rest (č ć đ š ž), each fetched only when used
  declarations: [{ prop: "unicode-range", value: "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD" }],
  variable: "--font-mono-face",
  display: "swap",
  preload: false,
  // no Arial-based metric fallback: the stack's monospace fallbacks (ui-monospace, Menlo, monospace) share Plex Mono's
  // 0.6 em advance, so mono lines (eyebrows, the availability badge) wrap the same before and after the swap (CLS)
  adjustFontFallback: false,
});

// Joins the family above: next/font names a local font after its export ("mono"), which is also what
// --font-mono-face resolves to.
const monoExt = localFont({
  src: [
    { path: "../assets/fonts/ibm-plex-mono-latin-ext-400.woff2", weight: "400" },
    { path: "../assets/fonts/ibm-plex-mono-latin-ext-500.woff2", weight: "500" },
  ],
  declarations: [
    { prop: "font-family", value: "mono" },
    { prop: "unicode-range", value: "U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C4, U+2113, U+2C60-2C7F, U+A720-A7FF" },
  ],
  display: "swap",
  preload: false,
  adjustFontFallback: false,
});

/** Referenced so the non-preloaded faces' @font-face rules are emitted (their class names are never applied). */
export const extraFaces = [displayRest.style.fontFamily, bodyRest.style.fontFamily, monoExt.style.fontFamily];
