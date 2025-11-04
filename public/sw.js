// ============================================================
// ✅ Service Worker - Découvrir le Pays Basque 🌶️
// Version légère, stable et compatible Next.js
// ============================================================

const CACHE_NAME = "decouvrir-pays-basque-v2"; // 🆙 Mets à jour le numéro à chaque modif
const OFFLINE_URL = "/offline.html";

// ============================================================
// 📦 INSTALLATION - Mise en cache initiale
// ============================================================
self.addEventListener("install", (event) => {
  console.log("📦 Installation du Service Worker…");

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("🧱 Mise en cache des fichiers statiques");

      return cache.addAll([
        "/", // page d’accueil
        "/offline.html",
        "/manifest.json",
        "/favicon.ico",
        "/apple-touch-icon.png",
        "/loading.html",
        "https://res.cloudinary.com/diccvjf98/image/upload/v1761916136/Votre_texte_de_paragraphe_wt8w7a.jpg", // fond principal
      ]);
    })
  );

  self.skipWaiting(); // 🔁 active immédiatement la nouvelle version
});

// ============================================================
// ♻️ ACTIVATION - Nettoyage des anciens caches
// ============================================================
self.addEventListener("activate", (event) => {
  console.log("🔄 Service Worker actif !");
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => {
            console.log("🗑️ Suppression ancien cache :", name);
            return caches.delete(name);
          })
      )
    )
  );
  self.clients.claim();
});

// ============================================================
// 🌐 FETCH - Gestion réseau + fallback hors ligne
// ============================================================
self.addEventListener("fetch", (event) => {
  // On ignore les requêtes non-GET (POST, etc.)
  if (event.request.method !== "GET") return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // ✅ Si la réponse est valide → on la met en cache
        if (response.status === 200) {
          const clonedResponse = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, clonedResponse);
          });
        }
        return response;
      })
      .catch(() => {
        // 🚫 Si échec réseau → on essaie le cache
        return caches.match(event.request).then((cached) => {
          if (cached) {
            return cached;
          }

          // 📄 Si c’est une page → on affiche offline.html
          if (event.request.destination === "document") {
            return caches.match(OFFLINE_URL);
          }
        });
      })
  );
});

// ============================================================
// 🔔 (Optionnel) Message pour forcer une mise à jour manuelle
// ============================================================
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
