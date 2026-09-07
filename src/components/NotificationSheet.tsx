import { BellRing } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Bottom sheet instead of the centre-screen popup — it lands next to the
 * thumb and does not cover the content behind it.
 */
export function NotificationSheet({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  async function enable() {
    if ("Notification" in window) await Notification.requestPermission();
    onClose();
  }

  return (
    <div
      className={cn(
        "fixed inset-0 z-60",
        open ? "visible" : "pointer-events-none invisible",
      )}
      role="dialog"
      aria-modal="true"
      aria-label="Notifications"
    >
      <div
        onClick={onClose}
        className={cn(
          "bg-navy-deep/50 absolute inset-0 backdrop-blur-[2px] transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0",
        )}
      />

      <div
        className={cn(
          "pb-safe absolute inset-x-0 bottom-0 mx-auto max-w-md rounded-t-3xl border-t border-slate-200 bg-white p-6 transition-transform duration-300 ease-out dark:border-white/10 dark:bg-[#101b2f]",
          open ? "translate-y-0" : "translate-y-full",
        )}
      >
        <span className="mx-auto mb-5 block h-1 w-10 rounded-full bg-slate-300 dark:bg-white/20" />

        <div className="flex flex-col items-center text-center">
          <span className="bg-brand/15 text-navy dark:text-brand flex size-14 items-center justify-center rounded-2xl">
            <BellRing className="size-7" />
          </span>
          <h2 className="text-navy mt-4 text-lg font-extrabold dark:text-white">
            Stay in the loop
          </h2>
          <p className="mt-1.5 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
            Get a ping when a form is approved or the office needs something — no need to
            keep opening the app.
          </p>
        </div>

        <div className="mt-6 space-y-2 pb-4">
          <button
            type="button"
            onClick={enable}
            className="bg-navy hover:bg-navy-deep h-12 w-full rounded-xl text-[15px] font-bold text-white transition-colors active:scale-[.98]"
          >
            Turn on notifications
          </button>
          <button
            type="button"
            onClick={onClose}
            className="h-11 w-full rounded-xl text-[15px] font-bold text-slate-500 transition-colors hover:bg-slate-100 dark:hover:bg-white/5"
          >
            Not now
          </button>
        </div>
      </div>
    </div>
  );
}
