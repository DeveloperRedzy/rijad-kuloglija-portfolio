import type { Media } from "@/content/schema";
import { ProductFrame } from "./ProductFrame";
import { SIZES } from "@/lib/media";

type Cell = { span: string; lone?: boolean };

// 6-column grid: a desktop/video item directly followed by a mobile item forms a 4+2 row;
// a lone desktop/video item spans 6; consecutive mobile items take 2 each. A mobile item alone on its row is
// centred (columns 3–4) with its caption beside it, instead of a phone stranded at the left edge.
function cells(items: Media[]): Cell[] {
  const out: Cell[] = [];
  let i = 0;
  while (i < items.length) {
    const m = items[i];
    if (m.kind !== "mobile") {
      if (items[i + 1]?.kind === "mobile") { out.push({ span: "md:col-span-4" }, { span: "md:col-span-2" }); i += 2; }
      else { out.push({ span: "md:col-span-6" }); i += 1; }
      continue;
    }
    // A run of mobile items not consumed by a preceding desktop/video item.
    let run = 0;
    while (items[i + run]?.kind === "mobile") run++;
    if (run === 1) out.push({ span: "md:col-span-6", lone: true });
    else for (let k = 0; k < run; k++) out.push({ span: "md:col-span-2" });
    i += run;
  }
  return out;
}

type Props = {
  items: Media[];
  slug: string;
  shader?: boolean;
  /** Below md only: the case hero's desktop capture, listed first (the phone capture took its place in the hero). */
  mobileLead?: Media;
  /** Below md only: the index of the item shown in the hero instead, left out of the list there. */
  mobileHidden?: number;
};

export function Gallery({ items, slug, shader, mobileLead, mobileHidden }: Props) {
  if (items.length === 0 && !mobileLead) return null;
  const layout = cells(items);
  return (
    <ul className="grid gap-5 md:grid-cols-6">
      {mobileLead && (
        <li className="md:hidden">
          <ProductFrame media={mobileLead} slug={`${slug}-gm`} morph={false} caption={mobileLead.caption} />
        </li>
      )}
      {items.map((m, i) => (
        <li key={m.src} className={`${layout[i].span} ${i === mobileHidden ? "hidden md:block" : ""}`}>
          <ProductFrame media={m} slug={`${slug}-g${i}`} morph={false} shader={shader} caption={m.caption} captionBeside={layout[i].lone} sizes={m.kind === "mobile" ? undefined : SIZES.gallery} />
        </li>
      ))}
    </ul>
  );
}
