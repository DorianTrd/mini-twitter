import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface User {
    id: number;
    name: string;
    email: string;
}

interface Post {
    id: number;
    title: string;
    img?: string;
    createdAt: string;
    author?: {
        id: number;
        name: string;
    };
}

const UserProfile: React.FC = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Récupération des données (user + posts)
    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    setError("Vous n'êtes pas connecté.");
                    setLoading(false);
                    return;
                }

                // Récupérer l'utilisateur
                const userRes = await fetch("http://localhost:5000/api/user", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const userData = await userRes.json();
                if (!userRes.ok) {
                    throw new Error(
                        userData.error || "Impossible de récupérer l'utilisateur."
                    );
                }
                setUser(userData);

                // Récupérer les posts de l'utilisateur
                const postsRes = await axios.get<Post[]>(
                    "http://localhost:5000/api/user/posts",
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                setPosts(postsRes.data);
            } catch (err: any) {
                console.error("Erreur lors du chargement des données :", err);
                setError("Impossible de charger les données.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    // Nouveau : bouton pour revenir à la liste de tous les posts
    const handleGoBackToPosts = () => {
        navigate("/home"); // Remplace "/" par "/posts" ou la route que tu utilises pour la liste des posts
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <span className="text-lg text-gray-500">Chargement...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <span className="text-lg text-red-500">{error}</span>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            {/* Navbar */}
            <nav className="flex justify-between items-center bg-white p-4 shadow-md">
                <h1 className="text-xl font-bold text-indigo-600">
                    {user ? `Bienvenue, ${user.name} !` : "Utilisateur inconnu"}
                </h1>
                <div className="flex gap-4">
                    {/* Bouton de retour à la liste des posts */}
                    <button
                        onClick={handleGoBackToPosts}
                        className="bg-green-500 text-white px-4 py-2 rounded"
                    >
                        Retour à la liste
                    </button>

                    {/* Bouton de déconnexion */}
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 text-white px-4 py-2 rounded"
                    >
                        Se Déconnecter
                    </button>
                </div>
            </nav>

            <h2 className="text-3xl font-semibold text-center text-indigo-600 mt-6">
                Vos posts
            </h2>

            <div className="max-w-4xl mx-auto mt-6">
                {posts.length === 0 ? (
                    <div className="text-center text-gray-500">
                        Vous n'avez pas encore posté.
                    </div>
                ) : (
                    posts.map((post) => (
                        <div
                            key={post.id}
                            className="bg-white p-4 mb-4 rounded-lg shadow-lg"
                        >
                            <h3 className="text-xl font-semibold text-gray-800">
                                {post.title}
                            </h3>
                            <p className="text-sm text-gray-600">
                                Publié le:{" "}
                                {new Date(post.createdAt).toLocaleDateString()}
                            </p>
                            {post.img && (
                                <img
                                    src={`data:image/png;base64,${post.img}`}
                                    alt="Post"
                                    className="mt-4 max-w-full h-auto rounded-lg"
                                />
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default UserProfile;
