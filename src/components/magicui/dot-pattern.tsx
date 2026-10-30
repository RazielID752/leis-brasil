import { useId } from "react";
import { cn } from "@/lib/utils";
/** Static SVG-pattern adaptation of Magic UI Dot Pattern (MIT). No motion in reading surfaces. */
export function DotPattern({ className }: { className?: string }) {
  const id = useId();
  return (
    <svg
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full text-emerald-800/25",
        className,
      )}
    >
      <defs>
        <pattern id={id} width="14" height="14" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r=".8" fill="currentColor" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}
