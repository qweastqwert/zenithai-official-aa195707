
const CACHE_NAME = 'zenith-ai-v1';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/lovable-uploads/289cf3ca-64e3-425c-8e29-1e27aae89509.png',
  '/lovable-uploads/44d18942-19e8-4d7b-9106-8c60ad68d16b.png'
];

// AI feature routes that require internet
const aiRoutes = ['/chat', '/api/chat'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Check if this is an AI feature request
  const isAIFeature = aiRoutes.some(route => url.pathname.includes(route)) || 
                     url.pathname.includes('/api/') ||
                     event.request.url.includes('openai') ||
                     event.request.url.includes('supabase');

  if (isAIFeature) {
    // For AI features, always try network first
    event.respondWith(
      fetch(event.request).catch(() => {
        return new Response(
          JSON.stringify({ 
            error: 'Internet connection required for AI features',
            offline: true 
          }),
          {
            status: 503,
            statusText: 'Service Unavailable',
            headers: { 'Content-Type': 'application/json' }
          }
        );
      })
    );
  } else {
    // For non-AI features, use cache-first strategy
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          // Return cached version or fetch from network
          return response || fetch(event.request);
        })
        .catch(() => {
          // If both cache and network fail, return offline page for navigation requests
          if (event.request.mode === 'navigate') {
            return caches.match('/');
          }
        })
    );
  }
});

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
});
