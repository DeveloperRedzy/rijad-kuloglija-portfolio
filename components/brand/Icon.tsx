export type IconName =
  | "arrow-up-right" | "arrow-right" | "arrow-left" | "mail" | "copy" | "check" | "download"
  | "external" | "close" | "menu" | "play" | "pause" | "github" | "linkedin";

export function Icon({ name, size = 18, className }: { name: IconName; size?: number; className?: string }) {
  return (
    <svg width={size} height={size} aria-hidden="true" focusable="false" className={className}>
      <use href={`/brand/icons.svg#${name}`} />
    </svg>
  );
}
