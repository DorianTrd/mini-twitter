import {useNavigate} from "react-router-dom";


interface PostCardProps {
    username: string; // Le nom d'utilisateur de la personne qui a créé le post
    content: string; // Le contenu du post
    createdAt: string; // La date de création du post
    img: string; // L'image associée au post
    userId: number; // L'ID de l'utilisateur ayant créé le post
}

function PostCard({username, content, createdAt, img, userId}: PostCardProps) {
    const navigate = useNavigate(); // Hook pour la navigation vers d'autres pages

    // Fonction qui est appelée lorsqu'on clique sur le nom de l'utilisateur (affiche le profil de l'utilisateur)
    const handlePostClick = () => {
        navigate(`/profile/${userId}`); // Redirection vers le profil de l'utilisateur avec son ID
    };

    return (
        <div className="bg-white p-4 rounded-md shadow-md mb-4">
            {/* Affichage du nom de l'utilisateur, clic pour naviguer vers son profil */}
            <div onClick={handlePostClick} className="font-bold text-xl cursor-pointer">
                {username}
            </div>
            {/* Affichage du contenu du post */}
            <p className="text-gray-700 mt-2">{content}</p>

            {/* Si une image est associée au post, elle est affichée */}
            {img && (
                <img
                    src={img} // Source de l'image
                    alt="Post Image" // Texte alternatif pour l'image
                    className="mt-4 max-w-full h-auto rounded-lg" // Styling de l'image
                />
            )}
            {/* Affichage de la date de création du post */}
            <span className="text-sm text-gray-500 mt-2 block">{createdAt}</span>
        </div>
    );
}

export default PostCard;
