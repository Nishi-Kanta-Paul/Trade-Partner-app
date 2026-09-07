import { Link } from "react-router-dom";
import {
  Camera,
  ChevronRight,
  CircleCheckBig,
  FileText,
  MapPin,
  PlayCircle,
  ReceiptText,
  ScrollText,
  Video,
  type LucideIcon,
} from "lucide-react";
import type { Action, ActionKind } from "@/data/stages";
import { ACCENTS, type Accent } from "@/lib/accents";
import { cn } from "@/lib/utils";

const ICONS: Record<ActionKind, LucideIcon> = {
  video: PlayCircle,
  form: FileText,
  call: Video,
  location: MapPin,
  photos: Camera,
  confirm: CircleCheckBig,
  invoice: ReceiptText,
  tax: ScrollText,
};

export function ActionRow({ action, accent }: { action: Action; accent: Accent }) {
  const Icon = ICONS[action.kind];
  const theme = ACCENTS[accent];

  const className = cn(
    "group flex items-center gap-3.5 rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg active:scale-[.985] dark:border-white/10 dark:bg-white/[.04]",
    theme.cardHover,
  );

  const body = (
    <>
      <span
        className={cn(
          "flex size-11 shrink-0 items-center justify-center rounded-xl transition-all duration-200 group-hover:scale-105 group-hover:shadow-md",
          theme.tile,
        )}
      >
        <Icon className="size-5" strokeWidth={2.2} />
      </span>

      <span className="min-w-0 flex-1">
        <span className="text-navy block truncate text-[15px] font-bold dark:text-white">
          {action.label}
        </span>
        <span className="mt-0.5 block truncate text-[13px] text-slate-500 dark:text-slate-400">
          {action.hint}
        </span>
      </span>

      {action.meta ? (
        <span
          className={cn(
            "shrink-0 rounded-full px-2.5 py-1 text-[11px] font-extrabold tracking-wide uppercase",
            theme.pill,
          )}
        >
          {action.meta}
        </span>
      ) : null}

      <ChevronRight className="size-4.5 shrink-0 text-slate-300 transition-transform duration-200 group-hover:translate-x-1 dark:text-slate-600" />
    </>
  );

  // In-app screens route; anything else opens as a normal link.
  return action.href.startsWith("/") ? (
    <Link to={action.href} className={className}>
      {body}
    </Link>
  ) : (
    <a href={action.href} target="_blank" rel="noreferrer" className={className}>
      {body}
    </a>
  );
}
