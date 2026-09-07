import { ActionRow } from "./ActionRow";
import { ACCENTS } from "@/lib/accents";
import { cn } from "@/lib/utils";
import type { Stage } from "@/data/stages";

export function StageSection({ stage }: { stage: Stage }) {
  const theme = ACCENTS[stage.accent];

  return (
    <section id={stage.id} className="scroll-mt-20">
      <div className="mb-4 flex items-center gap-3 px-1">
        <span
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-xl text-base font-extrabold shadow-lg",
            theme.badge,
          )}
        >
          {stage.index}
        </span>
        <div className="min-w-0">
          <h2 className="text-navy text-[17px] font-extrabold dark:text-white">
            {stage.title}
          </h2>
          <p className="text-[13px] text-slate-500 dark:text-slate-400">{stage.blurb}</p>
        </div>
      </div>

      <div className="space-y-2.5">
        {stage.actions.map((action) => (
          <ActionRow key={action.label} action={action} accent={stage.accent} />
        ))}
      </div>
    </section>
  );
}
