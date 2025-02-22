import React, {useState} from "react";
import axios from "axios";

const PostForm: React.FC = () => {
    // Définition des états locaux pour gérer le contenu du post et le nom d'utilisateur
    const [content, setContent] = useState(""); // Contenu du post
    const [username, setUsername] = useState(""); // Nom d'utilisateur

    // Fonction qui gère l'envoi du formulaire
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // Empêche le rechargement de la page lors de la soumission du formulaire
        try {
            // Envoi de la requête POST pour créer un nouveau post
            await axios.post("http://localhost:5000/api/posts", {
                username, // Envoi du nom d'utilisateur
                content,  // Envoi du contenu du post
            });
            setContent(""); // Réinitialisation du contenu du formulaire après l'envoi
        } catch (error) {
            console.error("Error creating post:", error);
        }
    };

    return (
        <div className="max-w-lg mx-auto p-4">
            {/* Formulaire d'ajout de post */}
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-md shadow-md">
                <div>
                    {/* Champ pour le nom d'utilisateur */}
                    <label className="block text-gray-700">Nom d'utilisateur</label>
                    <input
                        type="text"
                        value={username} // Lien entre la valeur de l'input et l'état username
                        onChange={(e) => setUsername(e.target.value)} // Mise à jour de l'état lors de la saisie
                        className="mt-2 p-2 w-full border border-gray-300 rounded-md"
                        required
                    />
                </div>
                <div className="mt-4">
                    {/* Champ pour le contenu du post */}
                    <label className="block text-gray-700">Contenu du post</label>
                    <textarea
                        value={content} // Lien entre la valeur du textarea et l'état content
                        onChange={(e) => setContent(e.target.value)} // Mise à jour de l'état lors de la saisie
                        className="mt-2 p-2 w-full border border-gray-300 rounded-md"
                        rows={4} // Nombre de lignes visibles dans la zone de texte
                        required // Champ requis
                    ></textarea>
                </div>
                {/* Bouton pour soumettre le formulaire */}
                <button type="submit" className="mt-4 bg-blue-600 text-white p-2 rounded-md">
                    Publier
                </button>
            </form>
        </div>
    );
};

export default PostForm; // Export du composant
