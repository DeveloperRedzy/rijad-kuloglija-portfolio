import type { Metadata, Viewport } from "next";
import { display, body, mono } from "./fonts";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { Grain } from "@/components/ui/Grain";
import { Vignette } from "@/components/ui/Vignette";
import { FaviconSwap } from "@/components/ui/FaviconSwap";
import { ConsoleSignature } from "@/components/ui/ConsoleSignature";
import { MotionRoot } from "@/components/motion/MotionRoot";
import { JsonLd } from "@/components/ui/JsonLd";
import { profile } from "@/content/profile";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(`https://www.${profile.domain}`),
  title: { default: "Redzy — Rijad Kuloglija", template: "%s — Redzy" },
  description: `${profile.title}. ${profile.headline}`,
  openGraph: { type: "website", siteName: "Redzy", locale: "en_US", images: [{ url: "/og/home.png", width: 1200, height: 630 }] },
  twitter: { card: "summary_large_image", images: ["/og/home.png"] },
  icons: { icon: [{ url: "/icon.svg", type: "image/svg+xml" }, { url: "/brand/icon-32.png", sizes: "32x32", type: "image/png" }], apple: "/brand/icon-180.png" },
};

export const viewport: Viewport = { themeColor: "#0A0908", colorScheme: "dark" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body className="bg-canvas text-ink">
        <MotionRoot>
          <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-canvas">Skip to content</a>
          <Navbar />
          <main id="main" className="pt-16">{children}</main>
          <Footer />
          <Vignette />
          <Grain />
        </MotionRoot>
        <FaviconSwap />
        <ConsoleSignature />
        <JsonLd />
      </body>
    </html>
  );
}
