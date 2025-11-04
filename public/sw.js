const CACHE_NAME = "decouvrir-pays-basque-v1";
const OFFLINE_URL = "/offline.html";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("🧱 Mise en cache des fichiers statiques");
      return cache.addAll([
        "/",
        "/offline.html",
        "/manifest.json",
        "/favicon.ico",
        "/apple-touch-icon.png",
      ]);
    })
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      )
    )
  );
  console.log("🔄 Service Worker actif !");
});

// Gestion des requêtes réseau + fallback hors ligne
self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request).then((response) => {
        return response || caches.match(OFFLINE_URL);
      });
    })
  );
});
