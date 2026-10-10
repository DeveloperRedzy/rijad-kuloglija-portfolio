export function Eyebrow({ children, className = "", as: Tag = "p" }: { children: React.ReactNode; className?: string; as?: "p" | "h2" }) {
  return <Tag className={`eyebrow ${className}`}>{children}</Tag>;
}
