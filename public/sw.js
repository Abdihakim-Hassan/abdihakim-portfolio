// Tuko Service Worker for PWA Instant Startup & Offline Resilience
const CACHE_NAME = 'tuko-pwa-v60-dashboard-sync-fix';
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon.svg',
  '/favicon.png',
  '/favicon.ico',
  '/apple-touch-icon.png',
  '/pwa-192x192.png',
  '/pwa-512x512.png',
  '/pwa-maskable-192x192.png',
  '/pwa-maskable-512x512.png',
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(PRECACHE_ASSETS).catch((err) => {
          console.warn('Some precache assets could not be cached immediately:', err);
        });
      })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => {
        return Promise.all(
          keys.map((key) => {
            if (key !== CACHE_NAME) {
              console.log('Purging outdated cache:', key);
              return caches.delete(key);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Allow client to trigger immediate activation
self.addEventListener('message', (event) => {
  if (event.data && (event.data.type === 'SKIP_WAITING' || event.data === 'skipWaiting')) {
    self.skipWaiting();
  }
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);

  // Allow Firestore, Google Auth, external CDNs and APIs to proceed directly to the network
  if (url.origin !== self.location.origin || url.pathname.startsWith('/api/')) {
    return;
  }

  // Always bypass cache or use network-first for Vite dev modules & source files
  if (
    url.pathname.startsWith('/src/') ||
    url.pathname.startsWith('/node_modules/') ||
    url.pathname.startsWith('/@') ||
    url.pathname.endsWith('.tsx') ||
    url.pathname.endsWith('.ts') ||
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.css')
  ) {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const contentType = networkResponse.headers.get('content-type') || '';
            if (!contentType.includes('text/html')) {
              const responseToCache = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseToCache));
            }
          }
          return networkResponse;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  const isNavigation =
    event.request.mode === 'navigate' ||
    event.request.headers.get('accept')?.includes('text/html');

  // NAVIGATION (HTML Documents - Network-First with verified offline fallback)
  if (isNavigation) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(CACHE_NAME);
        const cachedResponse =
          (await cache.match(event.request)) ||
          (await cache.match('/index.html')) ||
          (await cache.match('/'));

        try {
          // Allow reasonable network window (3500ms) for cellular/slow mobile connections
          const fetchPromise = fetch(event.request, { cache: 'no-cache' });
          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Network timeout')), 3500)
          );

          const networkResponse = await Promise.race([fetchPromise, timeoutPromise]);

          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            const text = await clone.text();

            // CRITICAL: Reject Google AI Studio compilation bootloader / "Reload now" page!
            const isAIStudioBootloader =
              text.includes('Please wait while your application starts') ||
              text.includes('issue during the build process') ||
              text.includes('Reload now') ||
              !text.includes('id="root"');

            if (!isAIStudioBootloader) {
              const freshResponse = new Response(text, {
                status: networkResponse.status,
                statusText: networkResponse.statusText,
                headers: networkResponse.headers,
              });
              cache.put(event.request, freshResponse.clone());
              cache.put('/index.html', freshResponse.clone());
              cache.put('/', freshResponse.clone());
              return freshResponse;
            } else {
              console.warn('AI Studio build state detected; preserving verified Tuko app cache.');
              if (cachedResponse) {
                return cachedResponse;
              }
            }
          }
        } catch (err) {
          // Network failed or device offline
        }

        // Return verified cached Tuko app instantly if network timed out, failed, or served AI Studio bootloader
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(event.request);
      })()
    );
    return;
  }

  // AUDIO STREAMING (Direct fetch with Range header support for MP3 audio)
  if (url.pathname.startsWith('/audio/')) {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
    return;
  }

  // STATIC ASSETS (Images, Icons)
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200) {
          return networkResponse;
        }

        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseToCache));
        return networkResponse;
      });
    })
  );
});

// Focus or open window when user taps the Adhan notification
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ('focus' in client) {
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow('/');
      }
    })
  );
});
