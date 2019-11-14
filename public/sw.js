var CACHE_STATIC_NAME = 'static-v15';
var CACHE_DYNAMIC_NAME = 'dynamic-v4';
var STATIC_FILES = [
  '/',
  '/index.html',
  '/offline.html',
  '/src/js/app.js',
  '/src/js/feed.js',
  '/src/js/promise.js',
  '/src/js/fetch.js',
  '/src/js/material.min.js',
  '/src/css/app.css',
  '/src/css/feed.css',
  '/src/images/main-image.jpg',
  'https://fonts.googleapis.com/css?family=Roboto:400,700',
  'https://fonts.googleapis.com/icon?family=Material+Icons',
  'https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.3.0/material.indigo-pink.min.css'
];
//https://stackoverflow.com/questions/38218859/whats-the-size-limit-of-cache-storage-for-service-worker
function trimCache(cacheName, maxItems) {
  caches.open(cacheName)
    .then((cache) => {
      return cache.keys()
        .then((keys) => {
          if (keys.length > maxItems) {
            //remove older item from cache
            cache.delete(keys[0])
              .then(trimCache(cacheName, maxItems));
          }
        })
    })
}

/* All that SWs do is listen to events, so everything needs to react to events
Ofc you dont have access to the DOM.
*/
/* Install is fired when browser installs the sw */
self.addEventListener('install', function (event) {
  console.log('[SW] Installing...', event)
  //Cache API

  //Because SWs runs asynchronous code, we need to use waitUntil,
  //if we dont do this we might fetch something from the cache that is not cached yet
  event.waitUntil(
    caches.open(CACHE_STATIC_NAME)
      .then((cache) => {
        console.log('[SW] Precaching App Shell');
        //add() sends the request to the server, gets the response and cache it
        cache.addAll(STATIC_FILES);
      })
  );
});

/* Activate is fired when browser not just install but activate the sw */
/* which means that you need to close the tab and reopen it to activate a new version of sw */
self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys()
      .then((keyList) => {
        return Promise.all(keyList.map((key) => {
          if (key !== CACHE_STATIC_NAME && key !== CACHE_DYNAMIC_NAME) {
            console.log('[SW] Removing old chache.', key);
            return caches.delete(key);
          }
        }));
      })
  )
  return self.clients.claim();
});

function isInArray(string, array) {
  for (let index = 0; index < array.length; index++) {
    if (array[index] === string) {
      return true;
    }
  }
  return false;
}

/* Every fetch event pass through this event, and so you can manipulate the response */
self.addEventListener('fetch', function (event) {
  var url = 'https://pwagram-776e4.firebaseio.com/posts';
  //if is this url we want to cache it always to get updated content
  //cache then network
  if (event.request.url.indexOf(url) > -1) {
    event.respondWith(
      caches.open(CACHE_DYNAMIC_NAME)
        .then(function (cache) {
          return fetch(event.request)
            .then(function (res) {
              // trimCache(CACHE_DYNAMIC_NAME, 3);
              cache.put(event.request, res.clone());
              return res;
            });
        })
    );
    //verify if the url matches the regex
    //cache only strategy for static files
  } else if (isInArray(event.request.url, STATIC_FILES)) {
    event.respondWith(
      caches.match(event.request)
    );
  } else {
    //cache with network fallback
    event.respondWith(
      caches.match(event.request)
        .then(function (response) {
          //if doesnt have it in cache response is null
          if (response) {
            //returning from the cache instead of requesting it to server
            return response;
          } else {
            //returning from the server because its not cached
            return fetch(event.request)
              .then(function (res) {
                //res is the response from the server, so we need to cache it
                return caches.open(CACHE_DYNAMIC_NAME)
                  .then((cache) => {
                    //put doesnt send any request, just store the data from response
                    //.clone() because the response is consumable, which means that once we call it we will not have anymore
                    cache.put(event.request.url, res.clone())
                    return res;
                  })
              })
              .catch((err) => {
                //if its not cached and we can't retrieve it from server too (offline)
                //get offline.html from cache
                return caches.open(CACHE_STATIC_NAME)
                  .then((cache) => {
                    if (event.request.headers.get('accept').includes('text/html')) {
                      return cache.match('/offline.html');
                    }
                  })
              })
          }
        })
    );
  }
});
