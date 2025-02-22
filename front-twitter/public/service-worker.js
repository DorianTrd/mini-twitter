import {cleanupOutdatedCaches, precacheAndRoute} from 'workbox-precaching';
import {registerRoute} from 'workbox-routing';
import {NetworkFirst} from 'workbox-strategies';
import {openDB} from 'idb';

// Nettoyage des caches obsolètes et mise en place de la gestion du cache initial
cleanupOutdatedCaches();

// Préchargement des ressources définies dans le manifeste de Workbox
precacheAndRoute([
    ...self.__WB_MANIFEST, // Inclusion des fichiers à précacher définis dans le manifeste
]);

// Enregistrement d'une route pour la gestion des requêtes réseau
registerRoute(({request}) => {
    // Filtre les requêtes GET vers le serveur local (http://localhost:5000)
    return request.url.startsWith('http://localhost:5000') && request.method == "GET";
}, new NetworkFirst(
    {
        cacheName: 'api-cache', // Nom du cache pour stocker les résultats des requêtes
    }
));

// Fonction asynchrone pour envoyer un post au serveur
async function sendPost(postData, key) {
    try {
        // Création d'un objet FormData pour envoyer les données du post
        const formData = new FormData();
        formData.append('title', postData.title); // Ajout du titre du post
        // Vérification et transformation de l'image en un objet Blob avant l'envoi
        const imgBlob = postData.img instanceof Blob ? postData.img : new Blob([postData.img]);
        formData.append('img', imgBlob, 'image.png'); // Ajout de l'image au FormData

        // Affiche les données du post dans la console avant de les envoyer
        console.log("Envoi des données du post : ", formData);

        // Envoi des données du post au serveur via une requête POST
        const response = await fetch('http://localhost:5000/api/posts', {
            method: 'POST', // Méthode HTTP utilisée
            headers: {
                'Authorization': 'Bearer ' + postData.token // Envoi du token d'autorisation
            },
            body: formData // Corps de la requête contenant les données du post
        });

        // Si la réponse n'est pas OK, on lance une erreur
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }

        // Affiche un message de succès dans la console
        console.log("Post envoyé avec succès ✅");

        // Ouverture de la base de données IndexedDB pour supprimer le post envoyé
        const db = await openDB('offline-mini-twitter', 1);
        await db.delete('posts', key); // Suppression du post de la base de données locale
    } catch (error) {
        // En cas d'échec, affiche une erreur dans la console
        console.error("Échec de l'envoi du post ❌", error);
    }
}

// Écouteur d'événement pour la synchronisation en arrière-plan
self.addEventListener("sync", async function (event) {
    // Affiche un message lorsque l'événement de synchronisation est déclenché
    console.log("Événement de synchronisation reçu 📡", event);

    // Si l'événement de synchronisation correspond à "sync-new-posts"
    if (event.tag === "sync-new-posts") {
        event.waitUntil(
            (async () => {
                // Ouverture de la base de données IndexedDB pour récupérer les posts en attente d'envoi
                const db = await openDB("offline-mini-twitter", 1);
                const posts = await db.getAll("posts"); // Récupère tous les posts dans la table 'posts'
                // Pour chaque post récupéré, on tente de l'envoyer
                for (const post of posts) {
                    await sendPost(post, post.id); // Appel de la fonction d'envoi de post
                }
            })()
        );
    }
});
