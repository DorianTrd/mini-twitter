import React from "react";
import PostCard from "./PostCard";

interface Post {
    id: number;
    title: string;
    img: string;
    createdAt: string;
    author: { name: string, id: number };
    userId: number;
}

interface PostListProps {
    posts: Post[];
    setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
}

const formatDate = (date: string) => {
    const now = new Date(date);
    return `le ${("0" + now.getDate()).slice(-2)}/${("0" + (now.getMonth() + 1)).slice(-2)}/${now.getFullYear()} à ${("0" + now.getHours()).slice(-2)}:${("0" + now.getMinutes()).slice(-2)}`;
};

const PostList: React.FC<PostListProps> = ({ posts }) => {
    return (
        <div className="max-w-lg mx-auto">
            {posts.length === 0 ? (
                <p className="text-center text-gray-500">Aucun post disponible.</p>
            ) : (
                posts.map((post) => (
                    <PostCard
                        key={post.id}
                        username={post.author.name}
                        content={post.title}
                        createdAt={formatDate(post.createdAt)}
                        img={post.img}
                        userId={post.userId}
                    />
                ))
            )}
        </div>
    );
};

export default PostList;
