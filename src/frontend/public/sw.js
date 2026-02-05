const CACHE_NAME = 'vibechat-v1';
const SHELL_ASSETS = [
  '/',
  '/index.html',
  '/assets/generated/vibechat-logo.dim_512x512.png',
  '/assets/generated/vibechat-pwa-icon.dim_192x192.png',
  '/assets/generated/vibechat-pwa-icon.dim_512x512.png',
  '/assets/generated/vibechat-pwa-icon-maskable.dim_512x512.png',
  '/assets/generated/vibechat-apple-touch-icon.dim_180x180.png',
  '/assets/generated/vibechat-favicon.dim_32x32.png'
];

// Install event - cache shell assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(SHELL_ASSETS).catch((err) => {
        console.warn('Failed to cache some assets during install:', err);
      });
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - cache-first for shell assets, network-first for everything else
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome-extension and other non-http(s) requests
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // Skip API calls and canister requests (network-only)
  if (url.pathname.includes('/api/') || url.hostname.includes('.ic0.app') || url.hostname.includes('.icp0.io')) {
    return;
  }

  // Cache-first strategy for shell assets
  if (SHELL_ASSETS.some(asset => url.pathname === asset || url.pathname.startsWith('/assets/'))) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(request).then((response) => {
          // Cache successful responses
          if (response && response.status === 200) {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseToCache);
            });
          }
          return response;
        });
      })
    );
  } else {
    // Network-first for everything else (app code, dynamic content)
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Optionally cache successful responses
          if (response && response.status === 200 && url.pathname.endsWith('.js') || url.pathname.endsWith('.css')) {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseToCache);
            });
          }
          return response;
        })
        .catch(() => {
          // Fallback to cache if network fails
          return caches.match(request);
        })
    );
  }
});
