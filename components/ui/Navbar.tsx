import Link from "next/link";
import { Lockup } from "@/components/brand/Lockup";
import { Icon } from "@/components/brand/Icon";
import { NavDot } from "./NavDot";
import { Pill } from "./Pill";
import { MobileMenu } from "./MobileMenu";
import { profile } from "@/content/profile";

export const NAV = [
  { label: "Work", href: "/#work" },
  { label: "About", href: "/#about" },
  { label: "Experience", href: "/#experience" },
  { label: "Contact", href: "/#contact" },
];

export function Navbar({ backLink }: { backLink?: boolean }) {
  return (
    <header
      style={{ viewTransitionName: "site-header" }}
      className="fixed inset-x-0 top-0 z-50 h-16 border-b border-hairline/60 bg-canvas/80 backdrop-blur-md"
    >
      <div className="container-site flex h-full items-center gap-6">
        <span className="relative inline-flex shrink-0">
          <Link href="/" aria-label="Redzy home" transitionTypes={["nav-back"]} className="inline-flex">
            <Lockup size={20} unlit />
          </Link>
          {/* Sibling of the link (no interactive-in-interactive), positioned over the monogram counter. */}
          <span className="pointer-events-none absolute left-0 top-1/2 h-5 w-5 -translate-y-1/2">
            <span className="absolute left-[46%] top-[32%] -translate-x-1/2 -translate-y-1/2">
              <NavDot />
            </span>
          </span>
        </span>
        {backLink && (
          <Link href="/#work" transitionTypes={["nav-back"]} className="eyebrow hidden items-center gap-1.5 hover:text-ink md:inline-flex">
            <Icon name="arrow-left" size={14} /> All work
          </Link>
        )}
        <nav aria-label="Primary" className="ml-auto hidden items-center gap-6 md:flex">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="eyebrow transition-colors hover:text-ink">{n.label}</Link>
          ))}
          <Pill href={`mailto:${profile.email}`} external dot className="py-2">Send a signal</Pill>
        </nav>
        <MobileMenu />
      </div>
    </header>
  );
}
