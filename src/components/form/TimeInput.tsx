import { cn } from "@/lib/utils";

/**
 * HH:MM plus an AM/PM toggle, stored as one "09:15 AM" string. A native
 * `time` input would be simpler but renders 24-hour on most Android phones,
 * which is not what the office reads on the report.
 */
export function TimeInput({
  value,
  onChange,
  invalid,
}: {
  value: string;
  onChange: (value: string) => void;
  invalid?: boolean;
}) {
  const [clock = "", meridiem = "AM"] = value.split(" ");

  return (
    <div className="flex items-center gap-2">
      <input
        type="text"
        inputMode="numeric"
        placeholder="HH:MM"
        maxLength={5}
        value={clock}
        onChange={(e) => {
          const digits = e.target.value.replace(/\D/g, "").slice(0, 4);
          const next =
            digits.length > 2 ? `${digits.slice(0, 2)}:${digits.slice(2)}` : digits;
          onChange(`${next} ${meridiem}`.trim());
        }}
        className={cn(
          "text-navy focus:border-navy focus:ring-navy/10 dark:focus:border-brand dark:focus:ring-brand/15 h-12 w-28 rounded-xl border border-slate-200 bg-white px-4 text-center text-[15px] font-semibold tabular-nums placeholder:font-normal placeholder:text-slate-400 focus:ring-4 focus:outline-none dark:border-white/12 dark:bg-white/[.04] dark:text-white",
          invalid && "border-rose-400",
        )}
      />

      <div className="flex overflow-hidden rounded-xl border border-slate-200 dark:border-white/12">
        {(["AM", "PM"] as const).map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(`${clock} ${option}`.trim())}
            aria-pressed={meridiem === option}
            className={cn(
              "h-12 w-14 text-[14px] font-bold transition-colors",
              meridiem === option
                ? "bg-navy dark:bg-brand dark:text-navy text-white"
                : "bg-white text-slate-500 hover:bg-slate-50 dark:bg-white/[.04] dark:text-slate-400",
            )}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
