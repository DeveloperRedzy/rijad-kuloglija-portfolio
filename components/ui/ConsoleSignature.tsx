"use client";
import { useEffect } from "react";
import { profile } from "@/content/profile";

export function ConsoleSignature() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    const art = [
      "██████╗ ",
      "██╔══██╗   Redzy · Rijad Kuloglija",
      "██████╔╝   Lead Software Developer",
      "██╔══██╗ ",
      "██║  ██║   Send a signal → " + profile.email,
      "╚═╝  ╚═╝ ",
    ].join("\n");
    console.log("%c" + art, "color:#FF4A26;font-family:ui-monospace,monospace;font-size:12px;line-height:1.2");
  }, []);
  return null;
}
