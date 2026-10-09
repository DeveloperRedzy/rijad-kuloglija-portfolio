"use client";
import { useEffect } from "react";

export function FaviconSwap() {
  useEffect(() => {
    const link = document.querySelector<HTMLLinkElement>('link[rel="icon"][type="image/svg+xml"]');
    if (!link) return;
    const lit = link.href;
    const onChange = () => { link.href = document.hidden ? "/brand/icon-muted.svg" : lit; };
    document.addEventListener("visibilitychange", onChange);
    return () => document.removeEventListener("visibilitychange", onChange);
  }, []);
  return null;
}
