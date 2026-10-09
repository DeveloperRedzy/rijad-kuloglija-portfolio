import localFont from "next/font/local";

export const display = localFont({
  src: [
    { path: "../public/fonts/cabinet-grotesk-700.woff2", weight: "700" },
    { path: "../public/fonts/cabinet-grotesk-800.woff2", weight: "800" },
  ],
  variable: "--font-display",
  display: "swap",
  preload: true,
});

export const body = localFont({
  src: [
    { path: "../public/fonts/switzer-400.woff2", weight: "400" },
    { path: "../public/fonts/switzer-500.woff2", weight: "500" },
    { path: "../public/fonts/switzer-600.woff2", weight: "600" },
  ],
  variable: "--font-body",
  display: "swap",
  preload: true,
});

export const mono = localFont({
  src: [
    { path: "../public/fonts/ibm-plex-mono-400.woff2", weight: "400" },
    { path: "../public/fonts/ibm-plex-mono-500.woff2", weight: "500" },
  ],
  variable: "--font-mono",
  display: "swap",
  preload: false,
});
