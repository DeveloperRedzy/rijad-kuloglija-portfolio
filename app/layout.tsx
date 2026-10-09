import type { Metadata } from "next";
import { display, body, mono } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Redzy — Rijad Kuloglija",
  description: "Lead Software Developer. Software that keeps working after launch.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
