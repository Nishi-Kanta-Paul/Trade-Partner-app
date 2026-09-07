import { Download, Share, SquarePlus, X } from "lucide-react";
import { useInstall } from "@/lib/install";

/**
 * Home-screen install banner. Sits above the safe area so it clears the iOS
 * home indicator, and dismissing it is remembered.
 */
export function InstallPrompt() {
  const { canShow, iosOnly, install, dismiss } = useInstall();

  if (!canShow) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 px-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
      <div className="animate-in slide-in-from-bottom-4 fade-in relative mx-auto max-w-md overflow-hidden rounded-2xl bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-700 p-4 text-white shadow-2xl shadow-indigo-900/40 duration-500">
        <span className="pointer-events-none absolute -top-12 -right-10 size-36 rounded-full bg-white/20 blur-2xl" />

        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss"
          className="absolute top-2.5 right-2.5 flex size-8 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/15 hover:text-white"
        >
          <X className="size-4" />
        </button>

        <div className="relative flex items-start gap-3.5">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/25">
            <Download className="size-5" />
          </span>

          <div className="min-w-0 flex-1 pr-6">
            <p className="text-[15px] font-extrabold">Install Trade Partner</p>

            {iosOnly ? (
              <p className="mt-1 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[13px] leading-relaxed text-white/80">
                Tap
                <Share className="inline size-4" />
                then
                <SquarePlus className="inline size-4" />
                <span className="font-bold">Add to Home Screen</span>
              </p>
            ) : (
              <>
                <p className="mt-1 text-[13px] leading-relaxed text-white/80">
                  Add it to your home screen — opens full screen and works on site without
                  signal.
                </p>
                <button
                  type="button"
                  onClick={install}
                  className="mt-3 h-10 rounded-xl bg-white px-5 text-[14px] font-extrabold text-indigo-700 shadow-lg transition-transform hover:scale-[1.02] active:scale-95"
                >
                  Install app
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
