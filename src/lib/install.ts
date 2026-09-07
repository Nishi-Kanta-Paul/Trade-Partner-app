import * as React from "react";

/** Chrome's install event — not in lib.dom yet. */
type InstallEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const DISMISSED_KEY = "tp-install-dismissed";
const INSTALLED_KEY = "tp-installed";

function read(key: string) {
  try {
    return localStorage.getItem(key) === "1";
  } catch {
    // Private browsing — fall back to "not set".
    return false;
  }
}

function remember(key: string) {
  try {
    localStorage.setItem(key, "1");
  } catch {
    // Nothing to do; the banner just comes back next visit.
  }
}

/** True when running from the home-screen icon rather than a browser tab. */
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

/**
 * Install state for the home-screen prompt.
 *
 * Chrome and Edge hand us a real install event, and stop firing it once the app
 * is installed. iOS Safari has neither the event nor any way to ask whether the
 * app is already on the home screen — so the first time the app is opened from
 * the icon we write that down and never offer the banner again.
 */
export function useInstall() {
  const [event, setEvent] = React.useState<InstallEvent | null>(null);
  const [dismissed, setDismissed] = React.useState(() => read(DISMISSED_KEY));
  const [installed, setInstalled] = React.useState(
    () => isStandalone() || read(INSTALLED_KEY),
  );

  React.useEffect(() => {
    // Opened from the icon — remember it, so the browser tab stops asking too.
    if (isStandalone()) remember(INSTALLED_KEY);

    const onPrompt = (e: Event) => {
      e.preventDefault();
      setEvent(e as InstallEvent);
    };
    const onInstalled = () => {
      remember(INSTALLED_KEY);
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
    remember(DISMISSED_KEY);
  }

  async function install() {
    if (!event) return;
    await event.prompt();
    const { outcome } = await event.userChoice;
    if (outcome === "accepted") {
      remember(INSTALLED_KEY);
      setInstalled(true);
    }
    setEvent(null);
  }

  // On iOS the only signal is "this is an iPhone and we're not in the app".
  const iosHint = isIOS() && !installed;

  return {
    /** Show the banner at all? */
    canShow: !installed && !dismissed && (!!event || iosHint),
    /** True when we can only give iOS instructions — no install API there. */
    iosOnly: !event && iosHint,
    installed,
    install,
    dismiss,
  };
}
