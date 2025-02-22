import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PostList, { Post } from "../components/PostList.tsx";
import { openDB } from "idb";
import toastr from "toastr";
import "toastr/build/toastr.min.css";

function Home() {
    const [title, setTitle] = useState("");
    const [img, setImage] = useState<File | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [user, setUser] = useState<{ id: string; name: string } | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const navigate = useNavigate();

    const fetchPosts = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/posts", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            const postsData = await response.json();
            if (response.ok) {
                setPosts(postsData);
            } else {
                console.error("Erreur lors de la récupération des posts", postsData);
            }
        } catch (error) {
            console.error("Erreur lors de la récupération des posts", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/user", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                const userData = await response.json();

                if (response.ok) {
                    setUser(userData);
                } else {
                    console.error("Erreur lors de la récupération de l'utilisateur", userData);
                    window.location.href = "/login";
                }
            } catch (error) {
                console.error("Erreur lors de la récupération de l'utilisateur", error);
                window.location.href = "/login";
            }
        };

        fetchUser();
        fetchPosts();

        // Ajouter un écouteur pour détecter la reconnexion à Internet
        const handleOnline = () => {
            toastr.success(
                "Vous êtes à nouveau en ligne. Vos posts ont été envoyés avec succès.",
                "Connexion restaurée"
            );
            window.location.reload(); // Rafraîchissement après synchronisation
        };

        window.addEventListener("online", handleOnline);

        return () => {
            window.removeEventListener("online", handleOnline);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const selectedFile = event.target.files[0];
            if (selectedFile && selectedFile.type.startsWith("image/")) {
                setImage(selectedFile);
                setImagePreview(URL.createObjectURL(selectedFile));
            } else {
                console.error("Veuillez sélectionner un fichier image");
                setImage(null);
                setImagePreview(null);
            }
        }
    };

    async function saveForLater(post: { title: string; img: File; token: string | null }) {
        const db = await openDB("offline-mini-twitter", 1, {
            upgrade(db) {
                if (!db.objectStoreNames.contains("posts")) {
                    db.createObjectStore("posts", { keyPath: "id", autoIncrement: true });
                }
            },
        });

        await db.add("posts", post);
        console.log("Post sauvegardé en offline ✅");

        toastr.warning(
            "Vous êtes hors ligne. Le post sera enregistré et envoyé une fois la connexion rétablie.",
            "Hors ligne"
        );

        if ("serviceWorker" in navigator && "SyncManager" in window) {
            const registration = await navigator.serviceWorker.ready;
            const syncManager = (registration as any).sync;

            if (syncManager) {
                try {
                    await syncManager.register("sync-new-posts");
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

    const handleCreatePost = async () => {
        if (!title || !img) {
            console.error("Le titre et l’image sont obligatoires");
            return;
        }

        const formData = new FormData();
        formData.append("title", title);
        formData.append("img", img);

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
                fetchPosts();
                setTitle("");
                setImage(null);
                setImagePreview(null);
                window.location.reload(); // Rafraîchissement de la page après création du post
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
            setTitle("");
            setImage(null);
            setImagePreview(null);
        }
    };

    const filteredPosts = posts.filter(
        (post) =>
            post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.author?.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 p-4 flex justify-center items-center">
                <p>Chargement...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <nav className="flex justify-between items-center bg-white p-4 shadow-md">
                <h1 className="text-xl font-bold text-indigo-600">
                    {user ? `Bienvenue, ${user.name} !` : "Utilisateur inconnu"}
                </h1>
                <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded">
                    Se Déconnecter
                </button>
            </nav>

            <h1 className="text-3xl font-semibold text-center text-indigo-600 mt-6">Création de Post</h1>

            <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-lg mt-6">
                <input
                    type="text"
                    placeholder="Titre du post"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg mb-4"
                />
                <input
                    type="file"
                    onChange={handleFileChange}
                    className="w-full p-3 border border-gray-300 rounded-lg mb-4"
                />
                {imagePreview && (
                    <img src={imagePreview} alt="Aperçu" className="max-w-full h-auto rounded-lg mb-4" />
                )}
                <button onClick={handleCreatePost} className="w-full py-3 bg-indigo-600 text-white rounded-lg">
                    Créer un post
                </button>
            </div>

            <hr className="my-6 border-gray-300" />

            <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl font-semibold text-indigo-600 mb-4">Liste des posts</h2>
                <input
                    type="text"
                    placeholder="Rechercher par titre ou nom d'auteur"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                />
                <PostList posts={filteredPosts} setPosts={setPosts} />
            </div>
        </div>
    );
}

export default Home;
