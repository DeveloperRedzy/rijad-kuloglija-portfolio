"use client";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/brand/Icon";

export function CopyEmailButton({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  const copy = async (e: React.MouseEvent) => {
    if (!navigator.clipboard) return; // falls through to mailto
    e.preventDefault();
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      window.location.href = `mailto:${email}`;
      return;
    }
    setCopied(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1600);
  };
  return (
    <>
      <a href={`mailto:${email}`} onClick={copy} data-magnetic className="group inline-flex items-center gap-4 rounded-full border border-hairline-strong px-6 py-4 font-display text-xl font-bold tracking-tight text-ink transition-colors hover:border-ink-muted md:text-3xl">
        <span className="sr-only">{email}</span>
        <span aria-hidden="true">{copied ? "Copied" : email}</span>
        <Icon name={copied ? "check" : "copy"} size={20} className={copied ? "text-signal" : "text-ink-muted group-hover:text-ink"} />
      </a>
      <span role="status" aria-live="polite" className="sr-only">{copied ? "Copied to clipboard" : ""}</span>
    </>
  );
}
