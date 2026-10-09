import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "outline";
  dot?: boolean;
  external?: boolean;
  transitionTypes?: string[];
  className?: string;
};

export function Pill({ href, children, variant = "primary", dot, external, transitionTypes, className = "" }: Props) {
  const base = "inline-flex items-center gap-2.5 rounded-full px-5 py-3 text-sm font-medium transition-[background,transform] duration-200 motion-reduce:transition-none";
  const look = variant === "primary"
    ? "bg-ink text-canvas hover:bg-signal-soft"
    : "border border-hairline-strong text-ink hover:border-ink-muted";
  const content = (
    <>
      {dot && <span aria-hidden className="h-2 w-2 rounded-full bg-signal shadow-[0_0_10px_3px_rgba(255,74,38,.7)]" />}
      {children}
    </>
  );
  if (external) {
    return <a href={href} target="_blank" rel="noreferrer" className={`${base} ${look} ${className}`} data-magnetic>{content}</a>;
  }
  return <Link href={href} transitionTypes={transitionTypes} className={`${base} ${look} ${className}`} data-magnetic>{content}</Link>;
}
