import React, { useEffect, useState } from "react";
import axios from "axios";
import PostCard from "./PostCard"; // Assurez-vous du bon chemin

// Définition du type pour un Post
interface Post {
    id: number;
    title: string;
    img: string;
    createdAt: string;
    author: { name: string }; // L’auteur est optionnel (si la relation ne fonctionne pas)
}

const PostList: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/posts");
                setPosts(response.data);
            } catch (error) {
                console.error("Erreur lors du chargement des posts :", error);
            }
        };

        fetchPosts();
    }, []);

    return (
        <div className="max-w-lg mx-auto">
            {posts.length === 0 ? (
                <p className="text-center text-gray-500">Aucun post disponible.</p>
            ) : (
                posts.map((post) => (
                    <PostCard
                        key={post.id}
                        username={post.author?.name} // Récupérer le nom de l’auteur
                        content={post.title} // Récupérer le titre du post
                        createdAt={post.createdAt}
                        img={post.img} // Image Base64
                    />
                ))
            )}
        </div>
    );
};

export default PostList;
