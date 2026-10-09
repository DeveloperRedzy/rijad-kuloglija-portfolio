import { Monogram } from "@/components/brand/Monogram";
import { Pill } from "@/components/ui/Pill";

export default function NotFound() {
  return (
    <section className="container-site flex min-h-[calc(100dvh-4rem)] flex-col items-center justify-center text-center">
      <Monogram size={160} lit={false} glow={false} className="text-[#1C1A18]" title="Redzy monogram, unlit" />
      <p className="eyebrow mt-10">404</p>
      <h1 className="display-lg mt-3">Lost signal.</h1>
      <p className="mt-4 max-w-[36ch] text-ink-soft">This page isn&apos;t lit. The work, the story and the contact are all back home.</p>
      <Pill href="/" dot className="mt-10" transitionTypes={["nav-back"]}>Back to the signal</Pill>
    </section>
  );
}
