import React from "react";

// Définir un type pour les props que ce composant recevra
interface PostCardProps {
    username: string;
    content: string;
    createdAt: string;
    img: string;
}

const PostCard: React.FC<PostCardProps> = ({ username, content, createdAt}) => {
    return (
        <div className="bg-white p-4 rounded-md shadow-md mb-4">
            <div className="font-bold text-xl">{username}</div>
            <p className="text-gray-700 mt-2">{content}</p>
            <span className="text-sm text-gray-500 mt-2 block">{createdAt}</span>
        </div>
    );
};

export default PostCard;
