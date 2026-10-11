"use client";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/brand/Icon";

/** The email as a mailto link, with a separate button that copies it. */
export function CopyEmailButton({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      // no clipboard access (insecure context, denied permission): open the mail client instead
      window.location.href = `mailto:${email}`;
      return;
    }
    setCopied(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1600);
  };
  return (
    <>
      <div data-magnetic className="inline-flex items-center rounded-full border border-hairline-strong transition-colors hover:border-ink-muted">
        <a href={`mailto:${email}`} className="py-4 pl-6 pr-2 font-display text-xl font-bold tracking-tight text-ink md:text-3xl">{email}</a>
        <button type="button" onClick={copy} aria-label="Copy email address" className="flex min-h-11 min-w-11 items-center justify-center self-stretch rounded-r-full pl-2 pr-6 text-ink-muted hover:text-ink">
          <Icon name={copied ? "check" : "copy"} size={20} className={copied ? "text-signal" : undefined} />
        </button>
      </div>
      <span role="status" aria-live="polite" className="sr-only">{copied ? "Copied to clipboard" : ""}</span>
    </>
  );
}
