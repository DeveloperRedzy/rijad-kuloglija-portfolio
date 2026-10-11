"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Icon } from "@/components/brand/Icon";
import { CTA, NAV } from "@/content/nav";
import { profile } from "@/content/profile";

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const wasOpen = useRef(false);
  const target = useRef<string | null>(null);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    if (open) {
      wasOpen.current = true;
      panel.current?.querySelector<HTMLElement>("button")?.focus();
    } else if (wasOpen.current) {
      wasOpen.current = false;
      const id = target.current;
      target.current = null;
      const section = id ? document.getElementById(id) : null;
      if (section) { section.tabIndex = -1; section.focus({ preventScroll: true }); }
      else button.current?.focus();
    }
    const onKey = (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === "Escape") return close();
      if (e.key !== "Tab" || !panel.current) return;
      const items = panel.current.querySelectorAll<HTMLElement>("button, a[href]");
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
        <div ref={panel} id="mobile-menu" role="dialog" aria-modal="true" aria-label="Menu" className="fixed inset-0 z-[55] flex flex-col bg-canvas px-6 pt-24">
          <button type="button" aria-label="Close menu" onClick={close} className="absolute right-6 top-0 flex h-16 items-center p-2 text-ink">
            <Icon name="close" size={22} />
          </button>
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} onClick={() => { const h = n.href.split("#")[1]; target.current = n.href.startsWith("/#") && h ? h : null; close(); }} className="display-md border-t border-hairline py-5">{n.label}</Link>
          ))}
          <a href={`mailto:${profile.email}?subject=${encodeURIComponent(CTA.subject)}`} onClick={close} className="mt-auto mb-10 border-t border-hairline pt-6">
            <span className="block font-display text-2xl font-bold tracking-tight text-signal-soft">{CTA.label}</span>
            <span className="eyebrow mt-2 block normal-case tracking-[0.04em]">{profile.email}</span>
          </a>
        </div>,
        document.body,
      )}
    </div>
  );
}
