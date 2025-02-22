import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { NetworkFirst } from 'workbox-strategies';
import { openDB } from 'idb';

cleanupOutdatedCaches();
precacheAndRoute([
    ...self.__WB_MANIFEST,
]);

registerRoute(({ request }) => {
    return request.url.startsWith('http://localhost:5000') && request.method == "GET";
}, new NetworkFirst(
    {
        cacheName: 'api-cache',
    }
));

function sendPost(postData, key) {
    return fetch('http://localhost:5000/api/posts', {
        method: 'POST',
        headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer ' + postData.token},
        body: JSON.stringify(postData)
    }).then(() => {
        return openDB('offline-twiteur', 1).then(db => {
            return db.delete('posts', key);
        });
    })
}

self.addEventListener('sync', function(event) {
    console.log("Received a sync event", event);
    if(event.tag === 'sync-new-posts'){
        event.waitUntil(
            openDB('offline-twitteur', 1).then(function(db){
                return db.getAll('posts').then(function(posts){
                    for(const post of posts){
                        sendPost(postData);
                    }
                });
            })
        );
    }
})