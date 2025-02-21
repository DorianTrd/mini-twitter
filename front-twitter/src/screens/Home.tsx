import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
    const [title, setTitle] = useState("");
    const [img, setImage] = useState<File | null>(null);
    const [posts, setPosts] = useState<any[]>([]);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [user, setUser] = useState<{ id: string; name: string } | null>(null);
    const [loading, setLoading] = useState(true);
    const [isFetching, setIsFetching] = useState(false); // Ajout de l'état pour vérifier si un appel est en cours
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/user", {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                const userData = await response.json();
                if (response.ok) {
                    setUser(userData); // Enregistre l'utilisateur
                } else {
                    console.error("Erreur lors de la récupération de l'utilisateur", userData);
                }
            } catch (error) {
                console.error("Erreur lors de la récupération de l'utilisateur", error);
            }
        };

        // Récupère les posts depuis le backend
        const fetchPosts = async () => {
            if (isFetching) return; // Si un appel est déjà en cours, on ne fait rien
            setIsFetching(true); // Marquer comme en cours de récupération

            try {
                const response = await fetch("http://localhost:5000/api/posts", {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                const postsData = await response.json();
                if (response.ok) {
                    // Ajoute l'auteur et la date à chaque post
                    const postsWithAuthor = postsData.map((post: any) => ({
                        ...post,
                        author: user?.name || "Auteur inconnu", // Associe l'auteur au post
                        date: new Date(post.createdAt).toLocaleDateString(), // Ajoute la date au format local
                    }));
                    setPosts(postsWithAuthor);
                } else {
                    console.error("Erreur lors de la récupération des posts", postsData);
                }
            } catch (error) {
                console.error("Erreur lors de la récupération des posts", error);
            } finally {
                setLoading(false); // Fin du chargement
                setIsFetching(false); // Remettre à false après l'appel
            }
        };

        // On récupère d'abord l'utilisateur puis les posts
        fetchUser();
        fetchPosts();
    }, []); // Changer pour ne pas dépendre de `user`

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

    const handleCreatePost = async () => {
        if (!title || !img) {
            console.error("Le titre, l’image et l'utilisateur sont obligatoires");
            return;
        }

        const formData = new FormData();
        formData.append("title", title);
        formData.append("img", img);

        try {
            const response = await fetch("http://localhost:5000/api/posts", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
                body: formData,
            });

            const postData = await response.json();
            if (response.ok) {
                console.log("Post créé avec succès", postData);
                // Ajoute l'auteur et la date aux posts créés
                setPosts([{ ...postData, author: user?.name, date: new Date().toLocaleDateString() }, ...posts]);
                setTitle("");
                setImage(null);
                setImagePreview(null);
            } else {
                console.error("Erreur lors de la création du post", postData);
            }
        } catch (error) {
            console.error("Erreur lors de la création du post", error);
        }
    };

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
                <div className="flex gap-4">
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 text-white px-4 py-2 rounded"
                    >
                        Se Déconnecter
                    </button>
                </div>
            </nav>

            <h1 className="text-3xl font-semibold text-center text-indigo-600 mt-6">Création de Post</h1>

            <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-lg mt-6">
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Titre du post"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
                <div className="mb-4">
                    <input
                        type="file"
                        onChange={handleFileChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                {imagePreview && (
                    <div className="mb-4">
                        <img src={imagePreview} alt="Aperçu" className="max-w-full h-auto rounded-lg" />
                    </div>
                )}

                <button
                    onClick={handleCreatePost}
                    className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none"
                >
                    Créer un post
                </button>
            </div>

            <hr className="my-6 border-gray-300" />

            <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl font-semibold text-indigo-600 mb-4">Liste des posts</h2>
                {posts.map((post: any) => (
                    <div key={post.id} className="bg-white p-4 mb-4 rounded-lg shadow-lg">
                        <h3 className="text-xl font-semibold text-gray-800">{post.title}</h3>
                        <p className="text-sm text-gray-600">Auteur : {post.author}</p>
                        <p className="text-sm text-gray-600">Date : {post.date}</p>

                        {post.img && (
                            <img
                                src={post.img.startsWith("data:image/") ? post.img : `http://localhost:5000/uploads/${post.img}`} // URL d'image ou base64
                                alt="Post"
                                className="mt-4 max-w-full h-auto rounded-lg"
                            />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Home;
