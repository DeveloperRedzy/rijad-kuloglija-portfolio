"use client";
import { useEffect } from "react";

export function FaviconSwap() {
  useEffect(() => {
    const link = document.querySelector<HTMLLinkElement>('link[rel="icon"][type="image/svg+xml"]');
    const lit = link?.href;
    const onChange = () => {
      document.documentElement.toggleAttribute("hidden-tab", document.hidden);
      if (link && lit) link.href = document.hidden ? "/brand/icon-muted.svg" : lit;
    };
    onChange();
    document.addEventListener("visibilitychange", onChange);
    return () => document.removeEventListener("visibilitychange", onChange);
  }, []);
  return null;
}
