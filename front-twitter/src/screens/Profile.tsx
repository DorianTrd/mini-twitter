import {useEffect, useState} from "react";
import {useParams, useNavigate} from "react-router-dom";
import PostList from "../components/PostList";

function UserProfile() {
    const {id} = useParams();  // Récupération de l'ID de l'utilisateur depuis l'URL
    const [posts, setPosts] = useState([]);  // État pour stocker les publications de l'utilisateur
    const [loading, setLoading] = useState(true); // État pour gérer l'indicateur de chargement
    const [notFound, setNotFound] = useState(false); // État pour gérer l'erreur si l'utilisateur n'est pas trouvé
    const navigate = useNavigate(); // Fonction de navigation pour rediriger l'utilisateur

    useEffect(() => {
        if (!id) return; // Si l'ID de l'utilisateur est absent, on ne fait rien

        const fetchPosts = async () => { // Fonction pour récupérer les publications de l'utilisateur
            setLoading(true); // Démarre le chargement
            try {
                // Appel à l'API pour récupérer les publications de l'utilisateur
                const response = await fetch(`http://localhost:5000/api/posts/user/${id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`, // Envoi du token d'authentification dans les en-têtes
                    },
                });

                // Si la réponse de l'API n'est pas correcte (status non OK), on gère l'erreur
                if (!response.ok) {
                    setNotFound(true); // Marque l'utilisateur comme non trouvé
                    throw new Error("Utilisateur non trouvé");
                }

                const postsData = await response.json(); // Récupère les données des publications
                if (postsData.length === 0) {
                    setNotFound(true);  // Si aucun post n'est trouvé, on marque l'erreur
                } else {
                    setPosts(postsData); // On met à jour l'état posts avec les publications récupérées
                }
            } catch (error) {
                console.error("Erreur lors de la récupération des posts", error); // Log de l'erreur dans la console
                setNotFound(true); // Si une erreur se produit, on marque l'utilisateur comme non trouvé
            } finally {
                setLoading(false); // La fin du chargement
            }
        };

        fetchPosts(); // Appel de la fonction pour récupérer les posts
    }, [id]); // Effectuer cet effet chaque fois que l'ID change

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600">
            <div className="container mx-auto px-4 py-8">
                {/* Bouton pour revenir à la page d'accueil */}
                <button
                    onClick={() => navigate("/home")}
                    className="mb-4 py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                    Retour à l'accueil
                </button>
                <h3 className="text-xl font-semibold text-white mb-6">Publications</h3>

                {/* Affichage des publications */}
                {notFound ? (
                    <p className="text-white">Aucun utilisateur trouvé ou pas de publications disponibles.</p>
                ) : loading ? (
                    <p className="text-white">Chargement des publications...</p>
                ) : (
                    <PostList posts={posts}/> // Affichage des publications à l'aide du composant PostList
                )}
            </div>
        </div>
    );
}

export default UserProfile;
