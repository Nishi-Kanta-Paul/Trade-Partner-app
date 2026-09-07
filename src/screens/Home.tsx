import * as React from "react";
// import { LifeBuoy } from "lucide-react"; // ← REVEAL: help card
import { AppBar } from "@/components/AppBar";
import { Hero } from "@/components/Hero";
import { StageSection } from "@/components/StageSection";
import { NotificationSheet } from "@/components/NotificationSheet";
import { STAGES } from "@/data/stages";

export default function Home() {
  const [bellOpen, setBellOpen] = React.useState(false);

  return (
    <div className="min-h-dvh bg-slate-50 dark:bg-[#0a1426]">
      <AppBar onBell={() => setBellOpen(true)} />
      <Hero />

      {/* Pulled up over the hero so the card stack reads as one sheet. */}
      <main className="relative z-10 -mt-16 rounded-t-[2rem] bg-slate-50 px-4 pt-7 shadow-[0_-12px_40px_-12px_rgba(11,31,75,.45)] dark:bg-[#0a1426]">
        <div className="mx-auto max-w-2xl space-y-9 pb-10">
          {STAGES.map((stage) => (
            <StageSection key={stage.id} stage={stage} />
          ))}

          {/* ══════════ REVEAL · "Stuck on something?" help card ══════════ */}
          {/* <HelpCard /> */}
        </div>
      </main>

      {/* ══════════ REVEAL · footer ══════════ */}
      {/* <footer className="pb-safe">
        <p className="pb-8 text-center text-xs text-slate-400 dark:text-slate-600">
          &copy; {new Date().getFullYear()} Cleaning Connected
        </p>
      </footer> */}

      <NotificationSheet open={bellOpen} onClose={() => setBellOpen(false)} />
    </div>
  );
}

// ══════════ REVEAL · uncomment together with <HelpCard /> above ══════════
// function HelpCard() {
//   return (
//     <a
//       href="https://www.cleaningconnected.com"
//       target="_blank"
//       rel="noreferrer"
//       className="relative flex items-center gap-3.5 overflow-hidden rounded-2xl bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-700 p-4 text-white shadow-lg shadow-indigo-500/30 transition-transform hover:-translate-y-0.5 active:scale-[.985]"
//     >
//       <span className="pointer-events-none absolute -top-12 -right-8 size-32 rounded-full bg-white/20 blur-2xl" />
//       <span className="relative flex size-11 shrink-0 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/25">
//         <LifeBuoy className="size-5" />
//       </span>
//       <span className="relative min-w-0">
//         <span className="block text-[15px] font-bold">Stuck on something?</span>
//         <span className="mt-0.5 block text-[13px] text-white/80">
//           Reach the Cleaning Connected office
//         </span>
//       </span>
//     </a>
//   );
// }
