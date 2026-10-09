"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Icon } from "@/components/brand/Icon";
import { NAV } from "./Navbar";
import { profile } from "@/content/profile";

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const wasOpen = useRef(false);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    if (open) {
      wasOpen.current = true;
      panel.current?.querySelector<HTMLElement>("a")?.focus();
    } else if (wasOpen.current) {
      wasOpen.current = false;
      button.current?.focus();
    }
    const onKey = (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === "Escape") return close();
      if (e.key !== "Tab" || !panel.current) return;
      const items = panel.current.querySelectorAll<HTMLElement>("a[href]");
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && (active === first || !panel.current.contains(active))) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && (active === last || !panel.current.contains(active))) { e.preventDefault(); first.focus(); }
    };
    window.addEventListener("keydown", onKey);
    return () => { window.removeEventListener("keydown", onKey); document.documentElement.style.overflow = ""; };
  }, [open, close]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = (e: MediaQueryListEvent) => { if (e.matches) close(); };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [close]);

  return (
    <div className="ml-auto md:hidden">
      <button ref={button} type="button" aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen((o) => !o)} className="p-2 text-ink">
        <Icon name={open ? "close" : "menu"} size={22} />
      </button>
      {open && createPortal(
        <div ref={panel} id="mobile-menu" role="dialog" aria-modal="true" aria-label="Menu" className="fixed inset-0 top-16 z-40 flex flex-col bg-canvas px-6 pt-10">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} onClick={close} className="display-md border-t border-hairline py-5">{n.label}</Link>
          ))}
          <a href={`mailto:${profile.email}`} onClick={close} className="mt-auto mb-10 border-t border-hairline pt-6 font-display text-2xl font-bold tracking-tight text-signal-soft">{profile.email}</a>
        </div>,
        document.body,
      )}
    </div>
  );
}
