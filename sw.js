const CACHE_NAME = "blaze-geeks-pwa-v19";
const APP_SHELL = [
  "/",
  "/index.html",
  "/manifest.webmanifest",
  "/app-icon.svg",
  "/assets/performance.css?v=3",
  "/assets/footer.css?v=3",
  "/assets/brand-system.css?v=2"
];

// Pre-cache the small shell and critical styles so repeat visits render quickly.
// Optional resources are isolated: one failed request never blocks installation.
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => Promise.allSettled(APP_SHELL.map(async path => {
        const response = await fetch(path, { cache: "reload" });
        if (response.ok) await cache.put(path, response);
      })))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)));
    if (self.registration.navigationPreload) {
      try { await self.registration.navigationPreload.enable(); } catch (_) {}
    }
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET" || new URL(request.url).origin !== self.location.origin) return;

  // Large video files are streamed by the browser; do not duplicate them in Cache Storage.
  const pathname = new URL(request.url).pathname;
  const isVideo = request.destination === "video" || /\.mp4$/i.test(pathname);

  if (request.mode === "navigate") {
    event.respondWith((async () => {
      const cached = await caches.match(request) || await caches.match("/index.html");
      const networkResponse = event.preloadResponse || fetch(request);
      if (cached) {
        event.waitUntil(Promise.resolve(networkResponse).then(async response => {
          if (response && response.ok) {
            const copy = response.clone();
            await caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
          }
        }).catch(() => {}));
        return cached;
      }
      const response = await networkResponse;
      if (response && response.ok) {
        const copy = response.clone();
        event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.put(request, copy)));
      }
      return response || await caches.match("/index.html");
    })());
    return;
  }

  // Cache-first for repeat static assets; update the cache after a network miss.
  // Skip video and range/media requests so streaming never waits on cache writes.
  if (isVideo || request.headers.has("range")) {
    event.respondWith(fetch(request));
    return;
  }

  event.respondWith((async () => {
    const cached = await caches.match(request);
    if (cached) return cached;
    const response = await fetch(request);
    if (response && response.ok) {
      const copy = response.clone();
      event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.put(request, copy)));
    }
    return response;
  })());
});
