import { profile } from "@/content/profile";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Icon } from "@/components/brand/Icon";

export function Lab() {
  return (
    <section id="lab" data-sweep-section className="border-t border-hairline py-24 md:py-32">
      <div className="container-site">
        <Eyebrow as="h2">04 — Lab &amp; more work</Eyebrow>
        <ol className="mt-8 border-t border-hairline">
          {profile.lab.map((item) => (
            <li key={item.name} data-row data-preview={item.previewSlug} className="grid gap-2 border-b border-hairline py-4 md:grid-cols-12 md:items-baseline md:gap-6">
              <p className="eyebrow md:col-span-2">{item.year}</p>
              <div className="md:col-span-7">
                <p className="font-medium text-ink">{item.name}</p>
                <p className="mt-1 max-w-[62ch] text-ink-soft">{item.line}</p>
              </div>
              <div className="flex gap-4 md:col-span-3 md:justify-end">
                {item.links?.map((l) => (
                  <a key={l.url} href={l.url} target="_blank" rel="noreferrer" className="eyebrow inline-flex items-center gap-1 hover:text-ink">{l.label} <Icon name="external" size={12} /></a>
                ))}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
