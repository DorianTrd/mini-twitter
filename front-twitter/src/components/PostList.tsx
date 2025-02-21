import React, { useEffect, useState } from "react";
import axios from "axios";
import PostCard from "./PostCard";

// Définition du type pour un Post
interface Post {
    title: string;
    img: string;
    createdAt: string;
    author: { name: string, id: number };
}

// Définition des props de PostList
interface PostListProps {
    posts?: Post[]; // La liste des posts peut être fournie en prop (optionnelle)
}

const PostList: React.FC<PostListProps> = ({ posts: propPosts }) => {
    const [posts, setPosts] = useState<Post[]>(propPosts || []);

    useEffect(() => {
        // Si des posts sont déjà fournis en prop, ne pas les recharger
        if (propPosts && propPosts.length > 0) return;

        const fetchPosts = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/posts");
                setPosts(response.data);
            } catch (error) {
                console.error("Erreur lors du chargement des posts :", error);
            }
        };

        fetchPosts();
    }, [propPosts]);

    return (
        <div className="max-w-lg mx-auto">
            {posts.length === 0 ? (
                <p className="text-center text-gray-500">Aucun post disponible.</p>
            ) : (
                posts.map((post) => (
                    <PostCard
                        key={post.author.id}
                        username={post.author.name}
                        content={post.title}
                        createdAt={post.createdAt}
                        img={post.img}
                    />
                ))
            )}
        </div>
    );
};

export default PostList;
