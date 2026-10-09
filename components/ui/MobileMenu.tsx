"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/brand/Icon";
import { NAV } from "./Navbar";
import { profile } from "@/content/profile";

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => { window.removeEventListener("keydown", onKey); document.documentElement.style.overflow = ""; };
  }, [open]);
  return (
    <div className="ml-auto md:hidden">
      <button type="button" aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen((o) => !o)} className="p-2 text-ink">
        <Icon name={open ? "close" : "menu"} size={22} />
      </button>
      {open && (
        <div id="mobile-menu" className="fixed inset-0 top-16 z-40 flex flex-col bg-canvas px-6 pt-10">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} onClick={() => setOpen(false)} className="display-md border-t border-hairline py-5">{n.label}</Link>
          ))}
          <a href={`mailto:${profile.email}`} className="mt-auto mb-10 border-t border-hairline pt-6 font-display text-2xl font-bold tracking-tight text-signal-soft">{profile.email}</a>
        </div>
      )}
    </div>
  );
}
