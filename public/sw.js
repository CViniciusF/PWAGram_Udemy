/* All that SWs do is listen to events, so everything needs to react to events
Ofc you dont have access to the DOM.
*/
/* Install is fired when browser installs the sw */
self.addEventListener('install', function(event) {
  console.log('[SW] Installing...', event)
})

/* Activate is fired when browser not just install but activate the sw */
/* which means that you need to close the tab and reopen it to activate a new version of sw */
self.addEventListener('activate', function(event) {
  console.log('[SW] Activating...', event)
  return self.clients.claim()
})

/* Every fetch event pass through this event, and so you can manipulate the response */
self.addEventListener('fetch', function(event) {
  console.log('[SW] Fetching...', event)
  event.respondWith(fetch(event.request))
})
