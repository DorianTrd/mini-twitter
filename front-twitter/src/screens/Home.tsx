import React, {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import PostList, {Post} from "../components/PostList.tsx";
import {openDB} from "idb";
import toastr from "toastr";
import "toastr/build/toastr.min.css";
import SearchBar from "../components/SearchBar";
import Header from "../components/Header";

function Home() {
    // Définition des hooks d'état pour gérer les données du composant
    const [title, setTitle] = useState(""); // Titre du post
    const [img, setImage] = useState<File | null>(null); // Image du post
    const [posts, setPosts] = useState<Post[]>([]); // Liste des posts
    const [imagePreview, setImagePreview] = useState<string | null>(null); // Prévisualisation de l'image
    const [user, setUser] = useState<{ id: string; name: string } | null>(null); // Utilisateur connecté
    const [loading, setLoading] = useState(true); // Indicateur de chargement
    const [searchQuery, setSearchQuery] = useState<string>(""); // Requête de recherche
    const navigate = useNavigate(); // Hook pour naviguer

    // Fonction pour récupérer la liste des posts depuis le serveur
    const fetchPosts = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/posts", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`, // Utilisation du token pour l'authentification
                },
            });
            const postsData = await response.json();
            if (response.ok) {
                setPosts(postsData); // Mise à jour de l'état avec les posts récupérés
            } else {
                console.error("Erreur lors de la récupération des posts", postsData);
            }
        } catch (error) {
            console.error("Erreur lors de la récupération des posts", error);
        } finally {
            setLoading(false); // Arrêt du chargement une fois les données récupérées
        }
    };

    // useEffect pour charger les données utilisateur et posts au démarrage
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/user", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`, // Authentification de l'utilisateur
                    },
                });
                const userData = await response.json();

                if (response.ok) {
                    setUser(userData); // Mise à jour de l'utilisateur connecté
                } else {
                    console.error("Erreur lors de la récupération de l'utilisateur", userData);
                    window.location.href = "/login"; // Redirection vers la page de connexion si l'utilisateur n'est pas valide
                }
            } catch (error) {
                console.error("Erreur lors de la récupération de l'utilisateur", error);
                window.location.href = "/login"; // Redirection en cas d'erreur
            }
        };

        fetchUser();
        fetchPosts();

        // Gestion de la reconnexion à Internet
        const handleOnline = () => {
            toastr.success(
                "Vous êtes à nouveau en ligne. Vos posts ont été envoyés avec succès.",
                "Connexion restaurée"
            );
            window.location.reload(); // Rafraîchissement après la reconnexion
        };

        // Ajout d'un écouteur pour détecter la reconnexion
        window.addEventListener("online", handleOnline);

        return () => {
            window.removeEventListener("online", handleOnline); // Nettoyage de l'écouteur
        };
    }, []);

    // Fonction de déconnexion
    const handleLogout = () => {
        localStorage.removeItem("token"); // Suppression du token de connexion
        navigate("/login"); // Redirection vers la page de login
    };

    // Fonction de gestion de changement de fichier (image)
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const selectedFile = event.target.files[0];
            if (selectedFile && selectedFile.type.startsWith("image/")) {
                setImage(selectedFile); // Mise à jour de l'image
                setImagePreview(URL.createObjectURL(selectedFile)); // Prévisualisation de l'image
            } else {
                console.error("Veuillez sélectionner un fichier image");
                setImage(null); // Réinitialisation si le fichier n'est pas une image
                setImagePreview(null);
            }
        }
    };

    // Fonction pour sauvegarder le post en mode hors ligne si l'utilisateur est déconnecté
    async function saveForLater(post: { title: string; img: File; token: string | null }) {
        const db = await openDB("offline-mini-twitter", 1, {
            upgrade(db) {
                if (!db.objectStoreNames.contains("posts")) {
                    db.createObjectStore("posts", {keyPath: "id", autoIncrement: true}); // Création d'un store pour les posts
                }
            },
        });

        await db.add("posts", post); // Ajout du post dans la base de données locale
        console.log("Post sauvegardé en offline ✅");

        toastr.warning(
            "Vous êtes hors ligne. Le post sera enregistré et envoyé une fois la connexion rétablie.",
            "Hors ligne"
        );

        // Vérification de la prise en charge du SyncManager pour la synchronisation
        if ("serviceWorker" in navigator && "SyncManager" in window) {
            const registration = await navigator.serviceWorker.ready;
            const syncManager = (registration as any).sync;

            if (syncManager) {
                try {
                    await syncManager.register("sync-new-posts"); // Enregistrement pour la synchronisation
                    console.log("SyncManager enregistré pour envoyer plus tard 🔄");
                } catch (syncError) {
                    console.error("Échec de l'enregistrement du SyncManager", syncError);
                }
            } else {
                console.warn("SyncManager non disponible, le post ne sera pas synchronisé automatiquement.");
            }
        } else {
            console.warn("SyncManager non supporté par ce navigateur.");
        }
    }

    // Fonction pour créer un post
    const handleCreatePost = async () => {
        if (!title || !img) {
            console.error("Le titre et l’image sont obligatoires");
            return;
        }

        const formData = new FormData();
        formData.append("title", title); // Ajout du titre
        formData.append("img", img); // Ajout de l'image

        try {
            const response = await fetch("http://localhost:5000/api/posts", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: formData,
            });

            const postData = await response.json();
            if (response.ok) {
                console.log("Post créé avec succès", postData);
                fetchPosts(); // Rafraîchissement de la liste des posts après création
                setTitle(""); // Réinitialisation du titre et de l'image
                setImage(null);
                setImagePreview(null);
                window.location.reload(); // Rafraîchissement de la page
            } else {
                console.error("Erreur lors de la création du post", postData);
            }
        } catch (error) {
            console.error("Erreur lors de la création du post (peut-être hors ligne)", error);
            saveForLater({
                title,
                img,
                token: localStorage.getItem("token"),
            });
            setTitle(""); // Réinitialisation du formulaire en cas d'erreur
            setImage(null);
            setImagePreview(null);
        }
    };

    // Filtrage des posts selon la requête de recherche
    const filteredPosts = posts.filter(
        (post) =>
            post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.author?.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Affichage pendant le chargement
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 p-4 flex justify-center items-center">
                <p>Chargement...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <Header user={user} handleLogout={handleLogout}/> {/* Affichage du header */}
            <h1 className="text-3xl font-semibold text-center text-indigo-600 mt-6">Création de Post</h1>

            <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-lg mt-6">
                <input
                    type="text"
                    placeholder="Titre du post"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)} // Mise à jour du titre
                    className="w-full p-3 border border-gray-300 rounded-lg mb-4"
                />
                <input
                    type="file"
                    onChange={handleFileChange} // Gestion du fichier image
                    className="w-full p-3 border border-gray-300 rounded-lg mb-4"
                />
                {imagePreview && (
                    <img src={imagePreview} alt="Aperçu" className="max-w-full h-auto rounded-lg mb-4"/>
                )}
                <button onClick={handleCreatePost} className="w-full py-3 bg-indigo-600 text-white rounded-lg">
                    Créer un post
                </button>
            </div>

            <hr className="my-6 border-gray-300"/>

            <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl font-semibold text-indigo-600 mb-4">Liste des posts</h2>
                <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery}/> {/* Barre de recherche */}
                <PostList posts={filteredPosts} setPosts={setPosts}/> {/* Liste des posts */}
            </div>
        </div>
    );
}

export default Home;
