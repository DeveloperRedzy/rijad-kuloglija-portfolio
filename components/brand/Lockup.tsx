import { Monogram } from "./Monogram";

export function Lockup({ size = 22 }: { size?: number }) {
  return (
    <span className="inline-flex items-center gap-[0.45em] text-ink" style={{ fontSize: size }}>
      <Monogram size={size} title="Redzy monogram" />
      <span className="font-display font-extrabold tracking-[-0.045em] leading-none" style={{ fontSize: size * 1.05 }}>
        Redzy
      </span>
    </span>
  );
}
