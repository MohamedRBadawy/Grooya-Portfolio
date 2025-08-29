const CACHE_NAME = 'grooya-portfolio-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/vite.svg',
  '/index.tsx', // The main script
  'https://cdn.tailwindcss.com?plugins=typography',
  'https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700&family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Inter:wght@400;500;600;700&family=Lato:ital,wght@0,400;0,700;1,400&family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Merriweather:ital,wght@0,400;0,700;1,400&family=Montserrat:wght@400;500;600;700&family=Noto+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Open+Sans:ital,wght@0,400;0,700;1,400&family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Poppins:wght@400;500;600;700&family=Raleway:ital,wght@0,400;0,500;0,600;1,400&family=Roboto:ital,wght@0,400;0,500;0,700;1,400&family=Source+Code+Pro:wght@400;500;600&family=Sora:wght@600;700;800&display=swap',
  // esm.sh dependencies from importmap
  "https://esm.sh/react@^19.1.1",
  "https://esm.sh/react-dom@^19.1.1/client",
  "https://esm.sh/react-router-dom@^7.8.1",
  "https://esm.sh/lucide-react@^0.418.0",
  "https://esm.sh/@dnd-kit/core@^6.1.0",
  "https://esm.sh/@dnd-kit/sortable@^8.0.0",
  "https://esm.sh/@dnd-kit/utilities@^3.2.2",
  "https://esm.sh/framer-motion@^11.3.19",
  "https://esm.sh/@tiptap/react@^2.5.8",
  "https://esm.sh/@tiptap/core@^2.5.8",
  "https://esm.sh/@tiptap/starter-kit@^2.5.8",
  "https://esm.sh/@tiptap/extension-link@^2.5.8",
  "https://esm.sh/cmdk@^1.0.0",
  "https://esm.sh/@google/genai",
  "https://esm.sh/@tiptap/extension-bubble-menu@^3.2.2",
  "https://esm.sh/react-hot-toast@^2.4.1"
];

// Install service worker and cache all app resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching app shell');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event: serve from cache first, with network fallback
self.addEventListener('fetch', (event) => {
  // We only want to cache GET requests.
  if (event.request.method !== 'GET') {
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        // Not in cache - fetch from network, and cache the response
        return fetch(event.request).then(
          (response) => {
            // Check if we received a valid response
            if(!response || response.status !== 200) {
              return response;
            }

            // IMPORTANT: Clone the response. A response is a stream
            // and because we want the browser to consume the response
            // as well as the cache consuming the response, we need
            // to clone it so we have two streams.
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
  );
});

// Activate event: clean up old caches
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Service Worker: Deleting old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
