import {cleanupOutdatedCaches, precacheAndRoute} from 'workbox-precaching';
import {registerRoute} from 'workbox-routing';
import {NetworkFirst} from 'workbox-strategies';
import {openDB} from 'idb';

cleanupOutdatedCaches();
precacheAndRoute([
    ...self.__WB_MANIFEST,
]);

registerRoute(({request}) => {
    return request.url.startsWith('http://localhost:5000') && request.method == "GET";
}, new NetworkFirst(
    {
        cacheName: 'api-cache',
    }
));

async function sendPost(postData, key) {
    try {
        const formData = new FormData();
        formData.append('title', postData.title);
        const imgBlob = postData.img instanceof Blob ? postData.img : new Blob([postData.img]);
        formData.append('img', imgBlob, 'image.png');

        // Affiche le contenu avant envoi
        console.log("Envoi des données du post : ", formData);

        const response = await fetch('http://localhost:5000/api/posts', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + postData.token
            },
            body: formData
        });

        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }

        console.log("Post envoyé avec succès ✅");

        const db = await openDB('offline-mini-twitter', 1);
        await db.delete('posts', key);
    } catch (error) {
        console.error("Échec de l'envoi du post ❌", error);
    }
}



self.addEventListener("sync", async function (event) {
    console.log("Événement de synchronisation reçu 📡", event);

    if (event.tag === "sync-new-posts") {
        event.waitUntil(
            (async () => {
                const db = await openDB("offline-mini-twitter", 1);
                const posts = await db.getAll("posts");

                console.log(`🔄 Tentative de synchronisation de ${posts.length} posts`);

                for (const post of posts) {
                    await sendPost(post, post.id);
                }
            })()
        );
    }
});

