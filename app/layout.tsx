import type { Metadata, Viewport } from "next";
import { display, body, mono } from "./fonts";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { Grain } from "@/components/ui/Grain";
import { Vignette } from "@/components/ui/Vignette";
import { FaviconSwap } from "@/components/ui/FaviconSwap";
import { ConsoleSignature } from "@/components/ui/ConsoleSignature";
import { JsonLd } from "@/components/ui/JsonLd";
import { profile } from "@/content/profile";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(`https://www.${profile.domain}`),
  title: { default: "Redzy — Rijad Kuloglija", template: "%s — Redzy" },
  description: `${profile.title}. ${profile.headline}`,
  openGraph: { type: "website", siteName: "Redzy", locale: "en_US" },
  twitter: { card: "summary_large_image" },
  icons: { icon: [{ url: "/icon.svg", type: "image/svg+xml" }, { url: "/brand/icon-32.png", sizes: "32x32", type: "image/png" }], apple: "/brand/icon-180.png" },
};

export const viewport: Viewport = { themeColor: "#0A0908", colorScheme: "dark" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body className="bg-canvas text-ink">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-canvas">Skip to content</a>
        <Navbar />
        <main id="main" className="pt-16">{children}</main>
        <Footer />
        <Vignette />
        <Grain />
        <FaviconSwap />
        <ConsoleSignature />
        <JsonLd />
      </body>
    </html>
  );
}
