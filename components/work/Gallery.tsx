import type { Media } from "@/content/schema";
import { ProductFrame } from "./ProductFrame";

// 6-column grid: a desktop/video item directly followed by a mobile item forms a 4+2 row;
// a lone desktop/video item spans 6; consecutive mobile items take 2 each.
function spans(items: Media[]): string[] {
  const out: string[] = [];
  for (let i = 0; i < items.length; i++) {
    if (items[i].kind === "mobile") out.push("md:col-span-2");
    else if (items[i + 1]?.kind === "mobile") { out.push("md:col-span-4", "md:col-span-2"); i++; }
    else out.push("md:col-span-6");
  }
  return out;
}

export function Gallery({ items, slug, shader }: { items: Media[]; slug: string; shader?: boolean }) {
  if (items.length === 0) return null;
  const cols = spans(items);
  return (
    <ul className="grid gap-5 md:grid-cols-6">
      {items.map((m, i) => (
        <li key={m.src} className={cols[i]}>
          <ProductFrame media={m} slug={`${slug}-g${i}`} morph={false} shader={shader} />
          {m.caption && <p className="eyebrow mt-3">{m.caption}</p>}
        </li>
      ))}
    </ul>
  );
}
