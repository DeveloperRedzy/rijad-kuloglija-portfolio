import type { Media } from "@/content/schema";
import { ProductFrame } from "./ProductFrame";

export function Gallery({ items, slug }: { items: Media[]; slug: string }) {
  if (items.length === 0) return null;
  return (
    <ul className="grid gap-5 md:grid-cols-[2fr_1fr]">
      {items.map((m, i) => (
        <li key={m.src} className={m.kind === "mobile" ? "" : "md:col-span-1"}>
          <ProductFrame media={m} slug={`${slug}-g${i}`} morph={false} />
          {m.caption && <p className="eyebrow mt-3">{m.caption}</p>}
        </li>
      ))}
    </ul>
  );
}
