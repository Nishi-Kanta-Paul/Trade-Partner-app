import * as React from "react";

/** Chrome's install event — not in lib.dom yet. */
type InstallEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const DISMISSED_KEY = "tp-install-dismissed";

function isStandalone() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    // iOS reports it here instead.
    (navigator as { standalone?: boolean }).standalone === true
  );
}

function isIOS() {
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

function wasDismissed() {
  try {
    return localStorage.getItem(DISMISSED_KEY) === "1";
  } catch {
    return false;
  }
}

/**
 * Install state for the home-screen prompt.
 *
 * Chrome and Edge hand us a real install event. iOS Safari has no such API, so
 * the only thing we can do is show the Share → Add to Home Screen steps.
 */
export function useInstall() {
  const [event, setEvent] = React.useState<InstallEvent | null>(null);
  const [dismissed, setDismissed] = React.useState(() => wasDismissed());
  const [installed, setInstalled] = React.useState(() => isStandalone());

  React.useEffect(() => {
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setEvent(e as InstallEvent);
    };
    const onInstalled = () => {
      setInstalled(true);
      setEvent(null);
    };

    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  function dismiss() {
    setDismissed(true);
    try {
      localStorage.setItem(DISMISSED_KEY, "1");
    } catch {
      // Private browsing — the banner just comes back next visit.
    }
  }

  async function install() {
    if (!event) return;
    await event.prompt();
    const { outcome } = await event.userChoice;
    if (outcome === "accepted") setInstalled(true);
    setEvent(null);
  }

  const iosHint = isIOS() && !installed;

  return {
    /** Show the banner at all? */
    canShow: true || dismissed,
    /** True when we can only give iOS instructions. */
    iosOnly: !event && iosHint,
    installed,
    install,
    dismiss,
  };
}
