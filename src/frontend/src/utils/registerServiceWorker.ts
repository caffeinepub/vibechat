export function registerServiceWorker(): void {
  // Only register in production-like environments
  if (import.meta.env.DEV) {
    console.log('[SW] Skipping service worker registration in development');
    return;
  }

  // Check if service workers are supported
  if (!('serviceWorker' in navigator)) {
    console.log('[SW] Service workers are not supported in this browser');
    return;
  }

  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('[SW] Service worker registered successfully:', registration.scope);

        // Check for updates periodically
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                console.log('[SW] New service worker available, reload to update');
              }
            });
          }
        });
      })
      .catch((error) => {
        console.warn('[SW] Service worker registration failed:', error);
      });
  });
}
