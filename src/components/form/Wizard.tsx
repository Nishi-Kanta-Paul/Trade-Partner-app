import * as React from "react";
import { ArrowLeft, ArrowRight, CircleCheckBig, LoaderCircle, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ACCENTS, type Accent } from "@/lib/accents";
import { cn } from "@/lib/utils";

export type Values = Record<string, string | string[] | File | File[] | null>;

/**
 * Step state, validation and navigation shared by every multi-step form.
 * `required` maps a step index to the field names that must be filled.
 */
export function useWizard<T extends Values>(
  initial: T,
  required: Record<number, string[]>,
  stepCount: number,
  /** Sends the finished form. Rejecting keeps the partner on the review step. */
  send?: (values: T) => Promise<void>,
) {
  const navigate = useNavigate();
  const [step, setStep] = React.useState(0);
  const [values, setValues] = React.useState<T>(initial);
  const [showErrors, setShowErrors] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  const [sending, setSending] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  function set<K extends keyof T>(key: K, value: T[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  function missing(name: string) {
    const value = values[name];
    if (Array.isArray(value)) return value.length === 0;
    if (value instanceof File) return false;
    return !String(value ?? "").trim();
  }

  const errorFor = (name: string) =>
    showErrors && missing(name) ? "This one is required." : undefined;

  const stepComplete = (required[step] ?? []).every((name) => !missing(name));

  function next() {
    if (!stepComplete) {
      setShowErrors(true);
      return;
    }
    setShowErrors(false);
    setStep((s) => Math.min(s + 1, stepCount - 1));
    window.scrollTo({ top: 0 });
  }

  function back() {
    if (step === 0) {
      navigate(-1);
      return;
    }
    setShowErrors(false);
    setStep((s) => s - 1);
    window.scrollTo({ top: 0 });
  }

  return {
    step,
    values,
    set,
    errorFor,
    stepComplete,
    next,
    back,
    submitted,
    sending,
    error,
    submit: async () => {
      if (sending) return;
      setError(null);
      setSending(true);
      try {
        await send?.(values);
        setSubmitted(true);
        window.scrollTo({ top: 0 });
      } catch (cause) {
        setError(
          cause instanceof Error ? cause.message : "Something went wrong. Try again.",
        );
      } finally {
        setSending(false);
      }
    },
  };
}

export function StepCard({
  title,
  blurb,
  accent = "sky",
  children,
}: {
  title: string;
  blurb?: string;
  accent?: Accent;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/[.03]">
      {/* Colour band ties the card to its stage. */}
      <div className={cn("h-1.5 w-full", ACCENTS[accent].fill)} />
      <div className="p-5">
        <h2 className="text-navy text-xl font-extrabold dark:text-white">{title}</h2>
        {blurb ? (
          <p className="mt-1 text-[14px] leading-relaxed text-slate-500 dark:text-slate-400">
            {blurb}
          </p>
        ) : null}
        <div className="mt-6 space-y-7">{children}</div>
      </div>
    </section>
  );
}

export function StepDots({
  steps,
  step,
  accent = "sky",
}: {
  steps: readonly string[];
  step: number;
  accent?: Accent;
}) {
  return (
    <ol className="mb-4 flex items-center gap-1.5" aria-label="Progress">
      {steps.map((label, i) => (
        <li
          key={label}
          className={cn(
            "h-1.5 flex-1 rounded-full transition-all duration-300",
            i <= step ? ACCENTS[accent].fill : "bg-slate-200 dark:bg-white/10",
          )}
        >
          <span className="sr-only">{label}</span>
        </li>
      ))}
    </ol>
  );
}

/** Sticky action bar so Back/Continue never scroll out of thumb reach. */
export function WizardActions({
  step,
  lastStep,
  stepComplete,
  onBack,
  onNext,
  onSubmit,
  submitLabel = "Submit",
  accent = "sky",
  sending,
  error,
}: {
  step: number;
  lastStep: number;
  stepComplete: boolean;
  onBack: () => void;
  onNext: () => void;
  onSubmit: () => void;
  submitLabel?: string;
  accent?: Accent;
  sending?: boolean;
  error?: string | null;
}) {
  return (
    <div className="pb-safe fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur-xl dark:border-white/10 dark:bg-[#0a1426]/95">
      {error ? (
        <p
          role="alert"
          className="mx-auto max-w-2xl px-4 pt-3 text-[13px] leading-relaxed font-semibold text-rose-600 dark:text-rose-400"
        >
          {error}
        </p>
      ) : null}

      <div className="mx-auto flex max-w-2xl gap-2.5 px-4 py-3">
        {step > 0 ? (
          <button
            type="button"
            onClick={onBack}
            className="text-navy flex h-13 items-center gap-2 rounded-xl border border-slate-200 px-5 text-[15px] font-bold transition-colors hover:bg-slate-100 active:scale-95 dark:border-white/12 dark:text-white dark:hover:bg-white/5"
          >
            <ArrowLeft className="size-4.5" />
            Back
          </button>
        ) : null}

        {step < lastStep ? (
          <button
            type="button"
            onClick={onNext}
            className={cn(
              "flex h-13 flex-1 items-center justify-center gap-2 rounded-xl text-[15px] font-bold transition-all active:scale-[.98]",
              stepComplete
                ? "bg-navy hover:bg-navy-deep dark:bg-brand dark:text-navy text-white"
                : "bg-slate-200 text-slate-500 dark:bg-white/10 dark:text-slate-400",
            )}
          >
            Continue
            <ArrowRight className="size-4.5" />
          </button>
        ) : (
          <button
            type="button"
            onClick={onSubmit}
            disabled={sending}
            className={cn(
              "flex h-13 flex-1 items-center justify-center gap-2 rounded-xl text-[15px] font-bold transition-all active:scale-[.98] disabled:opacity-70",
              ACCENTS[accent].button,
            )}
          >
            {sending ? (
              <>
                <LoaderCircle className="size-4.5 animate-spin" />
                Sending…
              </>
            ) : (
              <>
                <Send className="size-4.5" />
                {submitLabel}
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

export function Summary({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-4 bg-white px-4 py-3 dark:bg-transparent">
      <dt className="w-28 shrink-0 text-[13px] font-semibold text-slate-500 dark:text-slate-400">
        {label}
      </dt>
      <dd className="text-navy min-w-0 flex-1 text-[14px] font-semibold dark:text-white">
        {value.trim() || "—"}
      </dd>
    </div>
  );
}

export function SummaryList({ children }: { children: React.ReactNode }) {
  return (
    <dl className="divide-y divide-slate-200 overflow-hidden rounded-xl border border-slate-200 dark:divide-white/10 dark:border-white/10">
      {children}
    </dl>
  );
}

export function SubmittedScreen({
  title,
  message,
  accent = "emerald",
}: {
  title: string;
  message: string;
  accent?: Accent;
}) {
  const navigate = useNavigate();
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-slate-50 px-8 text-center dark:bg-[#0a1426]">
      <span
        className={cn(
          "flex size-24 items-center justify-center rounded-full text-white shadow-xl",
          ACCENTS[accent].fill,
        )}
      >
        <CircleCheckBig className="size-11" strokeWidth={2.4} />
      </span>
      <h1 className="text-navy mt-6 text-2xl font-extrabold dark:text-white">{title}</h1>
      <p className="mt-2 max-w-xs text-[15px] leading-relaxed text-slate-500 dark:text-slate-400">
        {message}
      </p>
      <button
        type="button"
        onClick={() => navigate("/", { replace: true })}
        className={cn(
          "mt-8 h-12 w-full max-w-xs rounded-xl text-[15px] font-bold transition-all active:scale-[.98]",
          ACCENTS[accent].button,
        )}
      >
        Back to home
      </button>
    </div>
  );
}
