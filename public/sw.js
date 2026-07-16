/* Lord-Coding portfolio — service worker (offline shell + asset cache) */
const VERSION = "v2";
const APP_CACHE = `lord-coding-app-${VERSION}`;
const RUNTIME_CACHE = `lord-coding-runtime-${VERSION}`;
const CORE_ASSETS = ["/", "/offline.html", "/manifest.webmanifest", "/favicon.ico", "/cv-lord.pdf"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(APP_CACHE).then((cache) => cache.addAll(CORE_ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(
      keys
        .filter((k) => k.startsWith("lord-coding-") && k !== APP_CACHE && k !== RUNTIME_CACHE)
        .map((k) => caches.delete(k))
    );
    await self.clients.claim();
  })());
});

self.addEventListener("message", (event) => {
  if (event.data === "SKIP_WAITING") self.skipWaiting();
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // HTML navigations — network-first, fallback to cached shell, then offline page
  if (req.mode === "navigate") {
    event.respondWith((async () => {
      try {
        const fresh = await fetch(req);
        const cache = await caches.open(APP_CACHE);
        cache.put("/", fresh.clone());
        return fresh;
      } catch {
        const cache = await caches.open(APP_CACHE);
        return (
          (await cache.match(req)) ||
          (await cache.match("/")) ||
          (await cache.match("/offline.html")) ||
          Response.error()
        );
      }
    })());
    return;
  }

  // Static assets — cache-first with runtime population, offline fallback for images
  if (/\.(?:js|css|woff2?|ttf|png|jpg|jpeg|svg|webp|ico|json|pdf)$/.test(url.pathname)) {
    event.respondWith((async () => {
      const cached = await caches.match(req);
      if (cached) return cached;
      try {
        const res = await fetch(req);
        if (res.ok) {
          const cache = await caches.open(RUNTIME_CACHE);
          cache.put(req, res.clone());
        }
        return res;
      } catch {
        if (cached) return cached;
        // Fallback offline page for missing resource types the browser might render
        const cache = await caches.open(APP_CACHE);
        const fallback = await cache.match("/offline.html");
        return fallback || Response.error();
      }
    })());
  }
});
