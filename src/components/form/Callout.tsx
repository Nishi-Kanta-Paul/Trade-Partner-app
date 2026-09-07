import { Info } from "lucide-react";

/** The "IMPORTANT" block from the paper form, made readable on a phone. */
export function Callout({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <aside className="rounded-xl border border-sky-200 bg-sky-50 p-4 dark:border-sky-400/25 dark:bg-sky-400/10">
      <p className="flex items-center gap-2 text-[13px] font-extrabold tracking-wide text-sky-800 uppercase dark:text-sky-300">
        <Info className="size-4" />
        {title}
      </p>
      <div className="mt-2 space-y-2 text-[14px] leading-relaxed text-sky-900/85 dark:text-sky-100/80">
        {children}
      </div>
    </aside>
  );
}
