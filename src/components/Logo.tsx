import { cn } from "@/lib/utils";

/**
 * Cleaning Connected mark — navy tile, yellow wordmark. Drawn as SVG so it
 * stays crisp at every size and needs no asset pipeline.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      role="img"
      aria-label="Cleaning Connected"
      className={cn("size-11 rounded-[22%]", className)}
    >
      <rect width="100" height="100" fill="#12315E" />
      <text
        x="50"
        y="42"
        textAnchor="middle"
        fontSize="38"
        fontWeight="800"
        letterSpacing="-1"
        fill="#F5B920"
        fontFamily="Plus Jakarta Sans, system-ui, sans-serif"
      >
        CC
      </text>
      <text
        x="50"
        y="64"
        textAnchor="middle"
        fontSize="15"
        fontWeight="700"
        fill="#F5B920"
        fontFamily="Plus Jakarta Sans, system-ui, sans-serif"
      >
        Cleaning
      </text>
      <text
        x="50"
        y="82"
        textAnchor="middle"
        fontSize="15"
        fontWeight="700"
        fill="#F5B920"
        fontFamily="Plus Jakarta Sans, system-ui, sans-serif"
      >
        Connected
      </text>
    </svg>
  );
}
