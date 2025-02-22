import React from "react";
import PostCard from "./PostCard";


export interface Post {
    id: number; // ID unique du post
    title: string; // Titre du post
    img: string; // URL de l'image associée au post
    createdAt: string; // Date de création du post
    author: { name: string, id: number }; // Auteur du post avec son nom et ID
    userId: number; // ID de l'utilisateur ayant créé le post
}

// Définition des props du composant PostList
interface PostListProps {
    posts: Post[]; // Liste des posts à afficher
    setPosts?: React.Dispatch<React.SetStateAction<Post[]>>;
}

// Fonction utilitaire pour formater la date d'un post
const formatDate = (date: string) => {
    const now = new Date(date); // Créer un objet Date à partir de la chaîne de date
    // Retourne la date sous un format spécifique : "le DD/MM/YYYY à HH:MM"
    return `le ${("0" + now.getDate()).slice(-2)}/${("0" + (now.getMonth() + 1)).slice(-2)}/${now.getFullYear()} à ${("0" + now.getHours()).slice(-2)}:${("0" + now.getMinutes()).slice(-2)}`;
};

const PostList: React.FC<PostListProps> = ({posts}) => {
    return (
        <div className="max-w-lg mx-auto">
            {/* Si aucun post n'est disponible, afficher ce message */}
            {posts.length === 0 ? (
                <p className="text-center text-gray-500">Aucun post disponible.</p>
            ) : (
                // Sinon, pour chaque post dans la liste, afficher un PostCard
                posts.map((post) => (
                    <PostCard
                        key={post.id} // Clé unique pour chaque post
                        username={post.author.name} // Nom de l'auteur du post
                        content={post.title} // Titre du post
                        createdAt={formatDate(post.createdAt)} // Date de création formatée
                        img={post.img} // Image du post
                        userId={post.userId} // ID de l'utilisateur ayant créé le post
                    />
                ))
            )}
        </div>
    );
};

export default PostList;
