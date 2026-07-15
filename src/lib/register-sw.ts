// Registers the portfolio service worker only in safe production contexts.
// Refuses to register (and cleans up existing regs) in Lovable preview, dev,
// iframes, or when the URL includes ?sw=off.
export function registerServiceWorker() {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

  const host = window.location.hostname;
  const url = new URL(window.location.href);
  const inIframe = window.self !== window.top;
  const isPreviewHost =
    host.startsWith("id-preview--") ||
    host.startsWith("preview--") ||
    host === "lovableproject.com" || host.endsWith(".lovableproject.com") ||
    host === "lovableproject-dev.com" || host.endsWith(".lovableproject-dev.com") ||
    host === "beta.lovable.dev" || host.endsWith(".beta.lovable.dev");
  const disabled = url.searchParams.get("sw") === "off";

  const shouldRefuse = !import.meta.env.PROD || inIframe || isPreviewHost || disabled;

  if (shouldRefuse) {
    navigator.serviceWorker.getRegistrations?.().then((regs) => {
      regs.forEach((r) => {
        if (r.active?.scriptURL?.endsWith("/sw.js")) r.unregister();
      });
    }).catch(() => {});
    return;
  }

  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  });
}
