import * as React from "react";
import { useAccent } from "@/lib/accents";
import { cn } from "@/lib/utils";

const base =
  "w-full rounded-xl border border-slate-200 bg-white px-4 text-[15px] text-navy transition-colors placeholder:text-slate-400 focus:outline-none focus:ring-4 dark:border-white/12 dark:bg-white/[.04] dark:text-white";

export function TextInput({
  className,
  invalid,
  ...props
}: React.ComponentProps<"input"> & { invalid?: boolean }) {
  const theme = useAccent();
  return (
    <input
      {...props}
      className={cn(base, theme.focus, "h-12", invalid && "border-rose-400", className)}
    />
  );
}

export function TextArea({
  className,
  invalid,
  ...props
}: React.ComponentProps<"textarea"> & { invalid?: boolean }) {
  const theme = useAccent();
  return (
    <textarea
      {...props}
      className={cn(
        base,
        theme.focus,
        "min-h-32 resize-y py-3 leading-relaxed",
        invalid && "border-rose-400",
        className,
      )}
    />
  );
}

/** Money field with a fixed $ affix so the value stays readable. */
export function MoneyInput({
  className,
  invalid,
  ...props
}: React.ComponentProps<"input"> & { invalid?: boolean }) {
  const theme = useAccent();
  return (
    <div className="relative">
      <span className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-[15px] font-bold text-slate-400">
        $
      </span>
      <input
        inputMode="decimal"
        {...props}
        className={cn(
          base,
          theme.focus,
          "h-12 pl-8 font-semibold",
          invalid && "border-rose-400",
          className,
        )}
      />
    </div>
  );
}
