import * as React from "react";
import { Bell } from "lucide-react";
import { Logo } from "./Logo";
import { cn } from "@/lib/utils";

/**
 * Compact app bar. Transparent over the hero, then it solidifies on scroll so
 * the page reads like a native screen rather than a website header.
 */
export function AppBar({ onBell }: { onBell: () => void }) {
  const [solid, setSolid] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "pt-safe fixed inset-x-0 top-0 z-40 transition-colors duration-300",
        solid
          ? "bg-navy-deep/85 border-b border-white/10 backdrop-blur-xl"
          : "border-b border-transparent",
      )}
    >
      <div className="mx-auto flex h-14 max-w-2xl items-center justify-between px-4">
        <div
          className={cn(
            "flex items-center gap-2.5 transition-all duration-300",
            solid ? "translate-y-0 opacity-100" : "-translate-y-1 opacity-0",
          )}
        >
          <Logo className="size-8" />
          <span className="text-[15px] font-extrabold text-white">Trade Partner</span>
        </div>

        <button
          type="button"
          onClick={onBell}
          aria-label="Notifications"
          className="flex size-10 items-center justify-center rounded-full text-white/90 transition-colors hover:bg-white/10 active:scale-95"
        >
          <Bell className="size-5" />
          <span className="bg-brand ring-navy-deep absolute mb-4 ml-4 size-2 rounded-full ring-2" />
        </button>
      </div>
    </header>
  );
}
