const CACHE_NAME = "blaze-geeks-pwa-v5";
const APP_SHELL = [
  "/",
  "/index.html",
  "/ai-metadata-remover.html",
  "/graphic-design-social-media-creatives.html",
  "/branding-visual-identity.html",
  "/advertising-banner-poster-design.html",
  "/video-editing-content-production.html",
  "/website-design-development.html",
  "/ai-powered-creative-solutions.html",
  "/technology-productivity-support.html",
  "/digital-marketing-creatives.html",
  "/youtube-thumbnail-promotional-design.html",
  "/custom-digital-creative-solutions.html",
  "/manifest.webmanifest",
  "/app-icon.svg"
];

// Cache each resource independently: one missing optional asset must not
// abort service-worker installation for the entire website.
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
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET" || new URL(request.url).origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).then(response => {
        if (response && response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
        }
        return response;
      }).catch(async () => (await caches.match(request)) || (await caches.match("/index.html")))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then(cached => cached || fetch(request).then(response => {
      if (response && response.ok) {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
      }
      return response;
    }))
  );
});
