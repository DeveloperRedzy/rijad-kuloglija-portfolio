import Link from "next/link";
import { Lockup } from "@/components/brand/Lockup";
import { NavDot } from "./NavDot";
import { Pill } from "./Pill";
import { MobileMenu } from "./MobileMenu";
import { profile } from "@/content/profile";
import { NAV } from "@/content/nav";

export function Navbar() {
  return (
    <header
      style={{ viewTransitionName: "site-header" }}
      className="fixed inset-x-0 top-0 z-50 h-16 border-b border-hairline/60 bg-canvas/80 backdrop-blur-md"
    >
      <div className="container-site flex h-full items-center gap-6">
        <span className="relative inline-flex shrink-0">
          <Link href="/" aria-label={`${profile.brand} home`} transitionTypes={["nav-back"]} className="inline-flex">
            <Lockup size={20} unlit decorative />
          </Link>
          {/* Sibling of the link (no interactive-in-interactive), positioned over the monogram counter. */}
          <span className="pointer-events-none absolute left-0 top-1/2 h-5 w-5 -translate-y-1/2">
            <span className="absolute left-[46%] top-[32%] -translate-x-1/2 -translate-y-1/2">
              <NavDot />
            </span>
          </span>
        </span>
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
