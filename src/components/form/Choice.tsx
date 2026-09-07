import { Check } from "lucide-react";
import { useAccent } from "@/lib/accents";
import { cn } from "@/lib/utils";

const card =
  "flex w-full items-center gap-3 rounded-xl border p-3.5 text-left text-[15px] font-semibold transition-all duration-150 active:scale-[.99]";
const off =
  "border-slate-200 bg-white text-navy hover:border-slate-300 dark:border-white/12 dark:bg-white/[.04] dark:text-white";

/** Tappable option cards — far easier to hit than a 20px radio dot. */
export function RadioGroup({
  options,
  value,
  onChange,
  columns,
}: {
  options: readonly string[];
  value: string;
  onChange: (value: string) => void;
  columns?: boolean;
}) {
  const theme = useAccent();

  return (
    <div className={cn("gap-2", columns ? "grid grid-cols-2" : "flex flex-col")}>
      {options.map((option) => {
        const selected = value === option;
        return (
          <button
            type="button"
            key={option}
            onClick={() => onChange(option)}
            aria-pressed={selected}
            className={cn(
              card,
              selected ? theme.selected : off,
              columns && "justify-center",
            )}
          >
            {!columns ? (
              <span
                className={cn(
                  "flex size-5 shrink-0 items-center justify-center rounded-full border-2",
                  selected ? theme.check : "border-slate-300 dark:border-white/25",
                )}
              >
                {selected ? (
                  <span className="dark:bg-navy size-1.5 rounded-full bg-white" />
                ) : null}
              </span>
            ) : null}
            <span className="min-w-0">{option}</span>
          </button>
        );
      })}
    </div>
  );
}

export function CheckboxGroup({
  options,
  value,
  onChange,
}: {
  options: readonly string[];
  value: string[];
  onChange: (value: string[]) => void;
}) {
  const theme = useAccent();

  function toggle(option: string) {
    onChange(
      value.includes(option) ? value.filter((v) => v !== option) : [...value, option],
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {options.map((option) => {
        const selected = value.includes(option);
        return (
          <button
            type="button"
            key={option}
            onClick={() => toggle(option)}
            aria-pressed={selected}
            className={cn(card, selected ? theme.selected : off)}
          >
            <span
              className={cn(
                "flex size-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors",
                selected ? theme.check : "border-slate-300 dark:border-white/25",
              )}
            >
              {selected ? (
                <Check className="dark:text-navy size-3.5 text-white" strokeWidth={3.5} />
              ) : null}
            </span>
            <span className="min-w-0">{option}</span>
          </button>
        );
      })}
    </div>
  );
}

/** Yes / No pair used for the agreement questions. */
export function YesNo({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return <RadioGroup options={["Yes", "No"]} value={value} onChange={onChange} columns />;
}
