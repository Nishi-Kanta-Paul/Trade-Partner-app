import * as React from "react";
import { cn } from "@/lib/utils";

/** Label + hint + error wrapper shared by every input on the form. */
export function Field({
  label,
  hint,
  error,
  required,
  children,
  className,
}: {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      <label className="text-navy block text-[15px] leading-snug font-bold dark:text-white">
        {label}
        {required ? <span className="ml-1 text-rose-500">*</span> : null}
      </label>
      {hint ? (
        <p className="-mt-1 text-[13px] text-slate-500 dark:text-slate-400">{hint}</p>
      ) : null}
      {children}
      {error ? (
        <p className="text-[13px] font-semibold text-rose-500" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
