// reference: https://github.com/rtc-2020/week-05
// String to identify site cache
const site_cache = 'site_cache';
// String to identify the offline path
const site_offline_path = '/offline/'

const site_autocached_assets = {
  essential: [ site_offline_path ],
  supporting: []
};
addEventListener('install', function(e) {
  console.log('Preparing to install the service worker...');
  e.waitUntil(
    caches.open(site_cache)
    .then(function(c) {
      c.addAll(site_autocached_assets.supporting);
      return c.addAll(site_autocached_assets.essential);
    })
    .catch(function(e) {
      console.error('Caches error:', e);
    })
  );
});
// end install event listener

addEventListener('activate', function(e) {
  console.log('The service worker is activated!');
  e.waitUntil(
    caches.keys()
    .then(function(existing_caches) {
      return Promise.all(
        existing_caches.map(function(existing_cache) {
          if (existing_cache != site_cache) {
            return caches.delete(existing_cache);
          }
        })
      );
    })
    .then(function(){
      // see https://developer.mozilla.org/en-US/docs/Web/API/Clients/claim
      return clients.claim();
    })
  // end waitUntil
  );
// end activate event listener
});

addEventListener('fetch', function(fe) {
  const request = fe.request;
  // HTML pages: try the network first
  if (request.headers.get('Accept').includes('text/html')) {
    fe.respondWith(
      fetch(request)
      .then(function(fetch_response) {
        const copy = fetch_response.clone();
        fe.waitUntil(
          caches.open(site_cache)
          .then(function(this_cache) {
            this_cache.put(request,copy);
          })
        );
        return fetch_response;
      })
      .catch(function(error) {
        return caches.match(request)
        .then(function(cached_response) {
          if (cached_response) {
            return cached_response;
          }
          return caches.match(site_offline_path);
        });

      })
    // end respondWith
    );
    return;
  } else {

    // caching using network first strategy
    fe.respondWith(
      caches.match(request)
      .then(function(cached_response) {
        if (cached_response) {
          fe.waitUntil(
            fetch(request)
            .then(function(fetch_response){
              caches.open(site_cache)
              .then(function(this_cache){
                return this_cache.put(request, fetch_response);
              });
            })
          );
          return cached_response;
        }
        return fetch(request)
        .then(function(fetch_response) {
          const copy = fetch_response.clone();
          fe.waitUntil(
            caches.open(site_cache)
            .then(function(this_cache) {
              this_cache.put(request, copy);
            })
          );
          return fetch_response;
        });
      })
    // end respondWith
    );
    return;
  }

});
