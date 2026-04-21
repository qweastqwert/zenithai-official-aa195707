
const CACHE_NAME = 'zenith-ai-v2';
const STATIC_CACHE = 'zenith-static-v2';
const DYNAMIC_CACHE = 'zenith-dynamic-v2';

// Core assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/zenith-logo-512.png',
  '/zenith-logo-512.png'
];

// AI/API routes that always need network
const NETWORK_ONLY_PATTERNS = [
  '/api/',
  'supabase.co',
  'openai.com',
  'googleapis.com'
];

// Assets that can be cached dynamically
const CACHEABLE_PATTERNS = [
  /\.js$/,
  /\.css$/,
  /\.woff2?$/,
  /\.ttf$/,
  /\.png$/,
  /\.jpg$/,
  /\.jpeg$/,
  /\.svg$/,
  /\.ico$/
];

function isNetworkOnly(url) {
  return NETWORK_ONLY_PATTERNS.some(pattern => url.includes(pattern));
}

function isCacheable(url) {
  return CACHEABLE_PATTERNS.some(pattern => pattern.test(url));
}

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        return cache.addAll(STATIC_ASSETS).catch(err => {
          console.log('Some static assets failed to cache:', err);
        });
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => {
            return name !== STATIC_CACHE && 
                   name !== DYNAMIC_CACHE && 
                   name !== CACHE_NAME;
          })
          .map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event
self.addEventListener('fetch', (event) => {
  const url = event.request.url;
  
  if (event.request.method !== 'GET') return;

  if (isNetworkOnly(url)) {
    event.respondWith(
      fetch(event.request).catch(() => {
        return new Response(
          JSON.stringify({ error: 'Internet connection required', offline: true }),
          { status: 503, statusText: 'Service Unavailable', headers: { 'Content-Type': 'application/json' } }
        );
      })
    );
    return;
  }

  if (isCacheable(url)) {
    event.respondWith(
      caches.open(DYNAMIC_CACHE).then((cache) => {
        return cache.match(event.request).then((cachedResponse) => {
          const fetchPromise = fetch(event.request)
            .then((networkResponse) => {
              if (networkResponse && networkResponse.status === 200) {
                cache.put(event.request, networkResponse.clone());
              }
              return networkResponse;
            })
            .catch(() => cachedResponse);
          return cachedResponse || fetchPromise;
        });
      })
    );
    return;
  }

  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(DYNAMIC_CACHE).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          return caches.match(event.request)
            .then((cachedResponse) => cachedResponse || caches.match('/'));
        })
    );
    return;
  }

  event.respondWith(
    fetch(event.request).then((response) => response).catch(() => caches.match(event.request))
  );
});

// Push notification handler
self.addEventListener('push', (event) => {
  let data = { title: 'Zenith AI', body: 'Time for a wellness check-in!', tag: 'general' };
  
  if (event.data) {
    try {
      data = { ...data, ...event.data.json() };
    } catch (e) {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: '/zenith-logo-512.png',
    badge: '/favicon.ico',
    tag: data.tag || 'general',
    vibrate: [100, 50, 100],
    data: { url: data.url || '/' },
    actions: data.actions || []
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const tag = event.notification.tag;
  let targetUrl = '/chat';

  if (tag === 'mood-reminder') {
    targetUrl = '/mood-tracking';
  } else if (tag === 'sleep-reminder' || tag === 'wake-reminder') {
    targetUrl = '/sleep-tracking';
  } else if (tag === 'journal-reminder') {
    targetUrl = '/chat';
  }

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.navigate(targetUrl);
          return client.focus();
        }
      }
      return clients.openWindow(targetUrl);
    })
  );
});

// Background sync
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-data') {
    event.waitUntil(Promise.resolve());
  }
});

// Handle messages
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((names) => Promise.all(names.map(name => caches.delete(name))))
    );
  }
});
