/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  معيار PRO - Service Worker v3.0                                ║
 * ║  نظام التقييم المعياري للمرافق الصحية - الجمهورية اليمنية       ║
 * ║  Offline-First PWA | Cache Strategy: Stale-While-Revalidate     ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */

const CACHE_NAME = 'maeyar-pro-v3-2026';
const STATIC_CACHE = 'maeyar-static-v3';
const DYNAMIC_CACHE = 'maeyar-dynamic-v3';
const IMAGE_CACHE = 'maeyar-images-v3';

// App Shell - Core assets
const APP_SHELL = [
    '/',
    '/index.html',
    '/offline.html',
    '/login.html',
    '/style.css',
    '/script.js',
    '/manifest.json',
    // External CDNs (cached as opaque responses)
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css',
    'https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Noto+Naskh+Arabic:wght@400;700&family=Cairo:wght@400;500;600;700;800;900&family=Tajawal:wght@300;400;500;700&family=Scheherazade+New:wght@400;700&display=swap'
];

// Install: Cache app shell
self.addEventListener('install', (event) => {
    console.log('[SW] Installing Maeyar PRO v3.0...');
    self.skipWaiting();

    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then((cache) => {
                console.log('[SW] Caching app shell...');
                return cache.addAll(APP_SHELL);
            })
            .catch((err) => {
                console.warn('[SW] Failed to cache some assets:', err);
            })
    );
});

// Activate: Clean old caches
self.addEventListener('activate', (event) => {
    console.log('[SW] Activating Maeyar PRO v3.0...');

    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (![STATIC_CACHE, DYNAMIC_CACHE, IMAGE_CACHE].includes(cacheName)) {
                        console.log('[SW] Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            return self.clients.claim();
        })
    );
});

// Fetch: Stale-While-Revalidate with offline fallback
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests and chrome extensions
    if (request.method !== 'GET' || url.protocol === 'chrome-extension:') {
        return;
    }

    // Strategy 1: Network First for API calls (if any)
    if (url.pathname.includes('/api/')) {
        event.respondWith(networkFirst(request));
        return;
    }

    // Strategy 2: Cache First for images
    if (request.destination === 'image' || url.pathname.match(/\.(png|jpg|jpeg|gif|svg|webp|ico)$/)) {
        event.respondWith(imageStrategy(request));
        return;
    }

    // Strategy 3: Stale-While-Revalidate for static assets
    if (request.destination === 'style' || request.destination === 'script' || request.destination === 'font') {
        event.respondWith(staleWhileRevalidate(request, STATIC_CACHE));
        return;
    }

    // Strategy 4: Default - Cache first, fallback to network, then offline page
    event.respondWith(cacheFirstWithOfflineFallback(request));
});

/**
 * Cache First with Offline Fallback
 */
async function cacheFirstWithOfflineFallback(request) {
    try {
        const cached = await caches.match(request);
        if (cached) {
            // Background revalidate
            fetch(request).then((response) => {
                if (response.ok) {
                    caches.open(DYNAMIC_CACHE).then((cache) => {
                        cache.put(request, response);
                    });
                }
            }).catch(() => {});
            return cached;
        }

        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        console.warn('[SW] Network failed, serving offline page:', error);

        // Return offline page for HTML requests
        if (request.headers.get('accept')?.includes('text/html')) {
            return caches.match('/offline.html');
        }

        // Return cached fallback for other resources
        const fallback = await caches.match(request);
        if (fallback) return fallback;

        // Generic error response
        return new Response(
            JSON.stringify({ error: 'Offline', message: 'لا يوجد اتصال بالإنترنت' }),
            { 
                status: 503, 
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }
}

/**
 * Stale-While-Revalidate Strategy
 */
async function staleWhileRevalidate(request, cacheName) {
    const cached = await caches.match(request);

    const fetchPromise = fetch(request).then((networkResponse) => {
        if (networkResponse.ok) {
            caches.open(cacheName).then((cache) => {
                cache.put(request, networkResponse.clone());
            });
        }
        return networkResponse;
    }).catch(() => cached);

    return cached || fetchPromise;
}

/**
 * Network First Strategy (for API calls)
 */
async function networkFirst(request) {
    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        const cached = await caches.match(request);
        if (cached) return cached;

        return new Response(
            JSON.stringify({ 
                error: 'Offline', 
                message: 'لا يوجد اتصال بالإنترنت. سيتم المزامنة عند استعادة الاتصال.' 
            }),
            { status: 503, headers: { 'Content-Type': 'application/json' } }
        );
    }
}

/**
 * Image Strategy: Cache First with placeholder fallback
 */
async function imageStrategy(request) {
    const cached = await caches.match(request);
    if (cached) return cached;

    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(IMAGE_CACHE);
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        // Return SVG placeholder for images
        if (request.url.includes('yemen-emblem')) {
            return new Response(getYemenEmblemSVG(), {
                headers: { 'Content-Type': 'image/svg+xml' }
            });
        }

        // Generic image placeholder
        return new Response(getImagePlaceholderSVG(), {
            headers: { 'Content-Type': 'image/svg+xml' }
        });
    }
}

/**
 * Background Sync for deferred actions
 */
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-assessments') {
        event.waitUntil(syncAssessments());
    }
    if (event.tag === 'sync-facilities') {
        event.waitUntil(syncFacilities());
    }
});

async function syncAssessments() {
    console.log('[SW] Syncing assessments...');
    // Implementation depends on IndexedDB usage in script.js
    const clients = await self.clients.matchAll({ type: 'window' });
    clients.forEach(client => {
        client.postMessage({ type: 'SYNC_ASSESSMENTS' });
    });
}

async function syncFacilities() {
    console.log('[SW] Syncing facilities...');
    const clients = await self.clients.matchAll({ type: 'window' });
    clients.forEach(client => {
        client.postMessage({ type: 'SYNC_FACILITIES' });
    });
}

/**
 * Push Notifications (optional)
 */
self.addEventListener('push', (event) => {
    const data = event.data?.json() ?? {};
    const title = data.title || 'معيار PRO';
    const options = {
        body: data.body || 'إشعار جديد من نظام التقييم المعياري',
        icon: '/images/favicon.png',
        badge: '/images/favicon.png',
        dir: 'rtl',
        lang: 'ar',
        tag: data.tag || 'maeyar-notification',
        requireInteraction: data.requireInteraction || false,
        actions: [
            { action: 'open', title: 'فتح التطبيق' },
            { action: 'close', title: 'إغلاق' }
        ],
        data: {
            url: data.url || '/'
        }
    };

    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    const { action, notification } = event;

    if (action === 'open' || action === 'default') {
        event.waitUntil(
            clients.openWindow(notification.data?.url || '/')
        );
    }
});

/**
 * SVG Placeholders
 */
function getYemenEmblemSVG() {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120">
        <defs>
            <radialGradient id="g" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#1a1a2e"/>
                <stop offset="100%" stop-color="#0a0a0f"/>
            </radialGradient>
        </defs>
        <circle cx="60" cy="60" r="58" fill="url(#g)" stroke="#D4AF37" stroke-width="2"/>
        <text x="60" y="45" text-anchor="middle" fill="#D4AF37" font-family="serif" font-size="14" font-weight="bold">الجمهورية</text>
        <text x="60" y="65" text-anchor="middle" fill="#D4AF37" font-family="serif" font-size="14" font-weight="bold">اليمنية</text>
        <text x="60" y="85" text-anchor="middle" fill="#C9A84C" font-family="serif" font-size="10">وزارة الصحة</text>
        <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(212,175,55,0.3)" stroke-width="0.5" stroke-dasharray="4 4"/>
    </svg>`;
}

function getImagePlaceholderSVG() {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
        <rect width="200" height="200" fill="#141414"/>
        <text x="100" y="100" text-anchor="middle" fill="#666" font-family="sans-serif" font-size="14">صورة غير متوفرة</text>
        <text x="100" y="120" text-anchor="middle" fill="#444" font-family="sans-serif" font-size="10">Offline Mode</text>
    </svg>`;
}

/**
 * Message handler from main thread
 */
self.addEventListener('message', (event) => {
    if (event.data === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    if (event.data === 'GET_VERSION') {
        event.ports[0].postMessage({ version: CACHE_NAME });
    }
    if (event.data.type === 'CACHE_ASSETS') {
        event.waitUntil(
            caches.open(DYNAMIC_CACHE).then((cache) => {
                return cache.addAll(event.data.assets || []);
            })
        );
    }
});


