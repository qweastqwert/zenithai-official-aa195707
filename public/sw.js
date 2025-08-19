
const CACHE_NAME = 'zenith-ai-v2';
const STATIC_CACHE = 'zenith-static-v2';
const DYNAMIC_CACHE = 'zenith-dynamic-v2';

// Static assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/lovable-uploads/289cf3ca-64e3-425c-8e29-1e27aae89509.png',
  '/lovable-uploads/44d18942-19e8-4d7b-9106-8c60ad68d16b.png',
  '/lovable-uploads/8c66f373-d747-4bde-80e0-54de377064bd.png',
  '/favicon.ico'
];

// Routes that require internet (AI features)
const ONLINE_ONLY_ROUTES = [
  '/chat',
  '/api/chat',
  '/mindmate',
  'openai.com',
  'supabase.co'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('SW: Installing service worker');
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then((cache) => {
        console.log('SW: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      }),
      caches.open(DYNAMIC_CACHE).then((cache) => {
        console.log('SW: Dynamic cache opened');
        return cache;
      })
    ]).then(() => {
      console.log('SW: Installation complete');
      self.skipWaiting();
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('SW: Activating service worker');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE && cacheName !== CACHE_NAME) {
            console.log('SW: Deleting old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('SW: Activation complete');
      self.clients.claim();
    })
  );
});

// Fetch event - handle all network requests
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Check if this is an online-only feature
  const isOnlineOnly = ONLINE_ONLY_ROUTES.some(route => 
    url.pathname.includes(route) || 
    url.hostname.includes('openai') ||
    url.hostname.includes('supabase') ||
    url.pathname.includes('/api/') ||
    event.request.url.includes('chat')
  );

  if (isOnlineOnly) {
    // For AI features, always try network first with offline fallback
    event.respondWith(
      fetch(event.request).catch(() => {
        return new Response(
          JSON.stringify({ 
            error: 'Internet connection required for AI features',
            offline: true,
            message: 'This feature requires an internet connection. Please check your network and try again.'
          }),
          {
            status: 503,
            statusText: 'Service Unavailable',
            headers: { 
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
            }
          }
        );
      })
    );
    return;
  }

  // For static assets and app routes, use cache-first strategy
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        console.log('SW: Serving from cache', event.request.url);
        return cachedResponse;
      }

      // Not in cache, try network
      return fetch(event.request).then((response) => {
        // Don't cache if not successful
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        // Clone the response for caching
        const responseToCache = response.clone();
        
        // Determine which cache to use
        const cacheToUse = STATIC_ASSETS.includes(url.pathname) ? STATIC_CACHE : DYNAMIC_CACHE;
        
        caches.open(cacheToUse).then((cache) => {
          console.log('SW: Caching new resource', event.request.url);
          cache.put(event.request, responseToCache);
        });

        return response;
      }).catch(() => {
        // Network failed, check if it's a navigation request
        if (event.request.mode === 'navigate') {
          return caches.match('/').then((cachedIndex) => {
            if (cachedIndex) {
              return cachedIndex;
            }
            // Fallback offline page
            return new Response(`
              <!DOCTYPE html>
              <html>
                <head>
                  <title>Zenith AI - Offline</title>
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <style>
                    body { 
                      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                      margin: 0; padding: 2rem; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                      color: white; min-height: 100vh; display: flex; align-items: center; justify-content: center; flex-direction: column;
                    }
                    .logo { width: 80px; height: 80px; margin-bottom: 1rem; border-radius: 20px; }
                    h1 { margin: 0 0 1rem 0; font-size: 2rem; }
                    p { margin: 0.5rem 0; opacity: 0.9; }
                    button { 
                      background: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.3); 
                      color: white; padding: 12px 24px; border-radius: 8px; cursor: pointer; 
                      font-size: 1rem; margin-top: 1rem; transition: all 0.2s;
                    }
                    button:hover { background: rgba(255,255,255,0.3); }
                  </style>
                </head>
                <body>
                  <img src="/lovable-uploads/289cf3ca-64e3-425c-8e29-1e27aae89509.png" alt="Zenith AI" class="logo">
                  <h1>Zenith AI</h1>
                  <p>You're currently offline</p>
                  <p>Non-AI features are still available when cached</p>
                  <button onclick="window.location.reload()">Try Again</button>
                </body>
              </html>
            `, {
              headers: { 'Content-Type': 'text/html' }
            });
          });
        }
        
        // For other requests, return a generic offline response
        return new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
      });
    })
  );
});

// Message handler for cache updates
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CACHE_URLS') {
    event.waitUntil(
      caches.open(DYNAMIC_CACHE).then((cache) => {
        return cache.addAll(event.data.urls);
      })
    );
  }
});

// Background sync for when connection returns
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    console.log('SW: Background sync triggered');
  }
});
