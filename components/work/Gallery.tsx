import type { Media } from "@/content/schema";
import { ProductFrame } from "./ProductFrame";

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

export function Gallery({ items, slug, shader }: { items: Media[]; slug: string; shader?: boolean }) {
  if (items.length === 0) return null;
  const layout = cells(items);
  return (
    <ul className="grid gap-5 md:grid-cols-6">
      {items.map((m, i) => {
        const frame = <ProductFrame media={m} slug={`${slug}-g${i}`} morph={false} shader={shader} />;
        if (layout[i].lone) {
          return (
            <li key={m.src} className={`${layout[i].span} md:grid md:grid-cols-6 md:items-end md:gap-5`}>
              <div className="md:col-span-2 md:col-start-3">{frame}</div>
              {m.caption && <p className="eyebrow mt-3 md:col-span-2 md:mt-0 md:pb-2">{m.caption}</p>}
            </li>
          );
        }
        return (
          <li key={m.src} className={layout[i].span}>
            {frame}
            {m.caption && <p className="eyebrow mt-3">{m.caption}</p>}
          </li>
        );
      })}
    </ul>
  );
}
