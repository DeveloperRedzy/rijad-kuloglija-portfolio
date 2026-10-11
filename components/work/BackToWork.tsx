import Link from "next/link";
import { Icon } from "@/components/brand/Icon";

export function BackToWork() {
  return (
    <Link href="/#work" transitionTypes={["nav-back"]} className="eyebrow -my-3.5 inline-flex items-center gap-1.5 py-3.5 hover:text-ink">
      <Icon name="arrow-left" size={14} /> All work
    </Link>
  );
}
