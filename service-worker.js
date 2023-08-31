// Google workbox -- not needed atm
// importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js');

// workbox.routing.registerRoute(
//     ({request}) => request.destination === 'image',
//     new workbox.strategies.CacheFirst()
// );

self.addEventListener('push', event => {
    console.log("push receieved");
    const title = event.data.text();
    console.log(title);
    event.waitUntil(
        self.registration.showNotification(title)
    );
});
