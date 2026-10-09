import { profile } from "@/content/profile";

export function AvailabilityBadge({ className = "" }: { className?: string }) {
  if (!profile.availability) return null;
  return (
    <p className={`eyebrow inline-flex items-center gap-2 ${className}`}>
      <span aria-hidden className="relative inline-flex h-2 w-2">
        <span className="absolute inset-0 rounded-full bg-signal motion-safe:animate-ping opacity-60" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-signal" />
      </span>
      {profile.availability}
    </p>
  );
}
