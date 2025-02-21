import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PostList from "../components/PostList.tsx";

function Home() {
    const [title, setTitle] = useState("");
    const [img, setImage] = useState<File | null>(null);
    const [posts, setPosts] = useState<any[]>([]);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [user, setUser] = useState<{ id: string; name: string } | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Déplace fetchPosts en dehors de useEffect
    const fetchPosts = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/posts", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
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
                        "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                const userData = await response.json();

                if (response.ok) {
                    setUser(userData); // Si la réponse est correcte, on met à jour l'utilisateur
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
        fetchPosts(); // Appel de fetchPosts ici pour initialiser la liste des posts
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
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
                body: formData,
            });

            const postData = await response.json();
            if (response.ok) {
                console.log("Post créé avec succès", postData);

                // Rafraîchissement des posts après la création
                fetchPosts(); // Appel de fetchPosts ici pour mettre à jour les posts

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
                {imagePreview && <img src={imagePreview} alt="Aperçu" className="max-w-full h-auto rounded-lg mb-4" />}
                <button onClick={handleCreatePost} className="w-full py-3 bg-indigo-600 text-white rounded-lg">
                    Créer un post
                </button>
            </div>

            <hr className="my-6 border-gray-300" />

            <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl font-semibold text-indigo-600 mb-4">Liste des posts</h2>
                <PostList posts={posts} setPosts={setPosts} />
            </div>
        </div>
    );
}

export default Home;
