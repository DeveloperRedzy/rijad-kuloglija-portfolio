import Link from "next/link";
import type { Project } from "@/content/schema";
import { Icon } from "@/components/brand/Icon";
import { pad2 } from "@/lib/format";

export function NextProject({ project }: { project: Project }) {
  return (
    <Link href={`/work/${project.slug}/`} transitionTypes={["nav-forward"]} className="group flex items-center justify-between gap-6 rounded-[var(--radius-frame)] border border-hairline p-7 transition-colors hover:border-signal/60 md:p-9" style={{ background: "linear-gradient(90deg, rgba(255,74,38,.06), rgba(255,74,38,0))" }}>
      <div>
        <p className="eyebrow">Next · {pad2(project.index)} / 05</p>
        <p className="display-md mt-2">{project.name}</p>
        <p className="mt-1 text-ink-muted">{project.oneLiner}</p>
      </div>
      <Icon name="arrow-right" size={28} className="shrink-0 text-signal transition-transform group-hover:translate-x-1" />
    </Link>
  );
}
