import type { Metadata } from "next";
import { NotFoundFlicker } from "@/components/ui/NotFoundFlicker";
import { Pill } from "@/components/ui/Pill";

export const metadata: Metadata = { title: "Page not found", robots: { index: false } };

export default function NotFound() {
  return (
    <section className="container-site flex min-h-[calc(100dvh-4rem)] flex-col items-center justify-center text-center">
      <NotFoundFlicker />
      <p className="eyebrow mt-10">404</p>
      <h1 className="display-lg mt-3">Lost signal.</h1>
      <p className="mt-4 max-w-[36ch] text-ink-soft">This page doesn&apos;t exist. Everything else is on the home page.</p>
      <Pill href="/" dot className="mt-10" transitionTypes={["nav-back"]}>Back to home</Pill>
    </section>
  );
}
