/* All that SWs do is listen to events, so everything needs to react to events
Ofc you dont have access to the DOM.
*/
/* Install is fired when browser installs the sw */
self.addEventListener('install', function(event) {
  console.log('[SW] Installing...', event)
})

/* Activate is fired when browser not just install but activate the sw */

self.addEventListener('activate', function(event) {
  console.log('[SW] Activating...', event)
  return self.clients.claim()
})
