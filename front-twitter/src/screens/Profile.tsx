import { useEffect, useState } from "react";
import {useParams, useNavigate} from "react-router-dom";
import PostList from "../components/PostList";


function UserProfile() {
    const { id } = useParams();  // Récupère l'ID de l'utilisateur depuis l'URL
    const [posts, setPosts] = useState([]);  // Stocke les posts récupérés
    const [loading, setLoading] = useState(true); // Gère le chargement
    const [notFound, setNotFound] = useState(false); // Gère l'erreur si l'utilisateur n'est pas trouvé
    const navigate = useNavigate(); // Pour la navigation

    useEffect(() => {
        if (!id) return;

        const fetchPosts = async () => {
            setLoading(true);
            try {
                const response = await fetch(`http://localhost:5000/api/posts/user/${id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });

                // Si la réponse n'est pas ok, on gère l'erreur
                if (!response.ok) {
                    setNotFound(true);
                    throw new Error("Utilisateur non trouvé");
                }

                const postsData = await response.json();
                if (postsData.length === 0) {
                    setNotFound(true);  // Si aucun post n'est trouvé
                } else {
                    setPosts(postsData); // On met à jour les posts
                }
            } catch (error) {
                console.error("Erreur lors de la récupération des posts", error);
                setNotFound(true); // En cas d'erreur générale
            } finally {
                setLoading(false); // Fin du chargement
            }
        };

        fetchPosts();
    }, [id]); // On relance l'effet quand l'ID change

    // Si l'utilisateur n'est pas trouvé, on redirige vers la page d'accueil
    if (notFound) {

    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600">
            <div className="container mx-auto px-4 py-8">
                {/* Bouton retour */}
                <button
                    onClick={() => navigate("/home")}
                    className="mb-4 py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                    Retour à l'accueil
                </button>

                {/* Titre des publications */}
                <h3 className="text-xl font-semibold text-white mb-6">Publications</h3>

                {/* Affichage des posts ou un message de chargement */}
                {loading ? (
                    <p className="text-white">Chargement des publications...</p>
                ) : (
                    <PostList posts={posts} />
                )}
            </div>
        </div>
    );
}

export default UserProfile;
