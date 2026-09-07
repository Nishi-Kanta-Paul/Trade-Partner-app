import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ACCENTS, type Accent } from "@/lib/accents";
import { cn } from "@/lib/utils";

/**
 * Fixed back bar for pushed screens. It wears the colour of the stage the
 * screen belongs to, with an optional progress rail so a long form always
 * shows how much is left.
 */
export function ScreenHeader({
  title,
  subtitle,
  progress,
  accent = "sky",
  onBack,
}: {
  title: string;
  subtitle?: string;
  /** 0–1. Omit for screens without steps. */
  progress?: number;
  accent?: Accent;
  onBack?: () => void;
}) {
  const navigate = useNavigate();

  return (
    <header
      className={cn(
        "pt-safe fixed inset-x-0 top-0 z-40 text-white shadow-lg",
        ACCENTS[accent].header,
      )}
    >
      <div className="mx-auto flex h-14 max-w-2xl items-center gap-2 px-2">
        <button
          type="button"
          onClick={() => (onBack ? onBack() : navigate(-1))}
          aria-label="Back"
          className="flex size-10 items-center justify-center rounded-full transition-colors hover:bg-white/20 active:scale-95"
        >
          <ChevronLeft className="size-6" />
        </button>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-[15px] font-extrabold">{title}</h1>
          {subtitle ? (
            <p className="truncate text-[12px] text-white/75">{subtitle}</p>
          ) : null}
        </div>
      </div>

      {progress !== undefined ? (
        <div className="h-1.5 w-full bg-black/20">
          <div
            className="h-full rounded-r-full bg-white transition-[width] duration-300 ease-out"
            style={{ width: `${Math.round(progress * 100)}%` }}
          />
        </div>
      ) : null}
    </header>
  );
}
