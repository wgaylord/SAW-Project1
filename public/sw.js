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
