import { registerSW } from "virtual:pwa-register";

/** How often an already-open app re-checks for a new deploy. */
const UPDATE_INTERVAL_MS = 30 * 60 * 1000;

/**
 * Registers the service worker in `autoUpdate` mode: a new build installs and
 * reloads on its own, so crews never have to think about versions.
 *
 * The browser checks for a new worker on navigation, which for an installed app
 * means "when it is opened". The interval and the focus listener cover the case
 * where someone leaves the app open on site all day.
 */
export function setupPWA() {
  if (import.meta.env.DEV) return;

  registerSW({
    onRegisteredSW(_swUrl, registration) {
      if (!registration) return;

      const check = () => {
        if (navigator.onLine) void registration.update();
      };

      setInterval(check, UPDATE_INTERVAL_MS);
      window.addEventListener("focus", check);
      window.addEventListener("online", check);
    },
  });
}
