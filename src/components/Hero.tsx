import { Sparkles } from "lucide-react";
import { Logo } from "./Logo";
import { STAGES } from "@/data/stages";
import { ACCENTS } from "@/lib/accents";
import { cn } from "@/lib/utils";

/**
 * Brand panel at the top of the screen. Colour blobs instead of a photo — no
 * large image to wait for on a site Wi-Fi connection, and it carries the three
 * stage colours so the tabs below read as a legend.
 */
export function Hero() {
  return (
    <section className="from-navy-deep via-navy pt-safe relative overflow-hidden bg-gradient-to-br to-indigo-800 px-5 pb-28 text-white">
      <div className="surface-grid pointer-events-none absolute inset-0 opacity-40" />
      <div className="bg-brand/30 pointer-events-none absolute -top-20 -right-24 size-72 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute top-32 -left-20 size-64 rounded-full bg-sky-400/25 blur-3xl" />
      <div className="pointer-events-none absolute right-10 -bottom-16 size-56 rounded-full bg-fuchsia-500/20 blur-3xl" />

      <div className="relative mx-auto max-w-2xl pt-20">
        <div className="flex items-center gap-4">
          <div className="relative">
            <span className="bg-brand/40 absolute -inset-1.5 rounded-2xl blur-md" />
            <Logo className="relative size-16 ring-1 ring-white/20" />
          </div>

          <span className="text-brand inline-flex items-center gap-1.5 rounded-full bg-white/12 px-3 py-1.5 text-[11px] font-extrabold tracking-[0.12em] uppercase ring-1 ring-white/15 ring-inset">
            <Sparkles className="size-3.5" />
            Trade Partner
          </span>
        </div>

        <h1 className="mt-6 text-[2.35rem] leading-[1.08] font-extrabold">
          Your job,
          <br />
          <span className="from-brand bg-gradient-to-r via-amber-200 to-sky-300 bg-clip-text text-transparent">
            step by step.
          </span>
        </h1>
        <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-white/70">
          Every form, video and check-in for the day — in the order you need them.
        </p>

        <nav className="mt-7 flex gap-2.5" aria-label="Job stages">
          {STAGES.map((stage) => (
            <a
              key={stage.id}
              href={`#${stage.id}`}
              className={cn(
                "flex-1 rounded-2xl px-3 py-3 text-center ring-1 backdrop-blur-sm transition-all duration-200 ring-inset hover:-translate-y-0.5 active:scale-95",
                ACCENTS[stage.accent].tab,
              )}
            >
              <span className="block text-lg leading-none font-extrabold">
                {stage.index}
              </span>
              <span className="mt-1 block text-[12px] font-bold text-white/85">
                {stage.tab}
              </span>
            </a>
          ))}
        </nav>
      </div>
    </section>
  );
}
