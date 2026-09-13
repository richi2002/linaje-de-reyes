/* =========================================================
   LINAJE DE REYES
   SERVICE WORKER - PWA
   ========================================================= */

const CACHE_NAME = "linaje-de-reyes-v6";

const ASSETS = [
    "./",
    "./index.html",
    "./catalogo.html",
    "./producto.html",
    "./404.html",
    "./style.css",
    "./catalogo.css",
    "./producto.css",
    "./script.js",
    "./catalogo.js",
    "./producto.js",
    "./manifest.json",
    "./logo.png"
];

/* Instalación */
self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(ASSETS))
            .then(() => self.skipWaiting())
            .catch(err => {
                console.error("[SW] Error crítico cacheando assets:", err);
                throw err; /* Falla la instalación del SW → visible en DevTools */
            })
    );
});

/* Activación */
self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys()
            .then(keys => Promise.all(
                keys
                    .filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            ))
            .then(() => self.clients.claim())
    );
});

/* Fetch */
self.addEventListener("fetch", event => {
    if (event.request.method !== "GET") return;

    /* Ignorar peticiones externas (Google Fonts, QR API, etc) */
    const url = new URL(event.request.url);
    if (url.origin !== location.origin) return;

    /* Fallback para navegación (offline → index.html) */
    if (event.request.mode === "navigate") {
        event.respondWith(
            fetch(event.request)
                .catch(() => caches.match("./index.html"))
        );
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then(cached => {
                const fetchPromise = fetch(event.request)
                    .then(response => {
                        if (response && response.status === 200) {
                            const clone = response.clone();
                            caches.open(CACHE_NAME).then(cache => {
                                cache.put(event.request, clone);
                            });
                        }
                        return response;
                    })
                    .catch(() => cached);

                return cached || fetchPromise;
            })
    );
});