import { auraSvg } from "@/lib/aura";

export function Aura({ seed, width = 1200, height = 630, className }: { seed: string; width?: number; height?: number; className?: string }) {
  const svg = auraSvg(seed, width, height);
  return (
    <div
      aria-hidden="true"
      className={className}
      style={{ backgroundImage: `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`, backgroundSize: "cover", backgroundPosition: "center" }}
    />
  );
}
