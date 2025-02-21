import { useNavigate } from "react-router-dom";

interface PostCardProps {
    username: string;
    content: string;
    createdAt: string;
    img: string;
    userId: number; // Remplacement de postId par idUser
}

function PostCard({ username, content, createdAt, img, userId }: PostCardProps) {
    const navigate = useNavigate();

    const handlePostClick = () => {
        navigate(`/profile/${userId}`); // Utilisation de idUser pour la navigation
    };

    return (
        <div className="bg-white p-4 rounded-md shadow-md mb-4">
            <div onClick={handlePostClick} className="font-bold text-xl cursor-pointer">{username}</div>
            <p className="text-gray-700 mt-2">{content}</p>
            {img && (
                <img
                    src={img}
                    alt="Post Image"
                    className="mt-4 max-w-full h-auto rounded-lg"
                />
            )}
            <span className="text-sm text-gray-500 mt-2 block">{createdAt}</span>
        </div>
    );
}

export default PostCard;
