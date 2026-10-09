import { Monogram } from "@/components/brand/Monogram";

export function HeroPoster() {
  return (
    <div data-hero-poster className="relative mx-auto aspect-square w-[min(72vw,520px)] lg:w-[min(38vw,620px)]">
      <div aria-hidden className="absolute inset-[-20%] rounded-full" style={{ background: "radial-gradient(circle at 46% 36%, rgba(255,74,38,.28), rgba(255,74,38,.06) 35%, transparent 60%)" }} />
      <Monogram size={620} className="relative h-full w-full text-[#1C1A18] [filter:drop-shadow(0_0_24px_rgba(255,74,38,.35))]" title="Redzy monogram" glow={false} />
    </div>
  );
}
