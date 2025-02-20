import React, { useState } from "react";
import axios from "axios";

const PostForm: React.FC = () => {
    const [content, setContent] = useState("");
    const [username, setUsername] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:5000/api/posts", {
                username,
                content,
            });
            setContent(""); // Reset form
        } catch (error) {
            console.error("Error creating post:", error);
        }
    };


    return (
        <div className="max-w-lg mx-auto p-4">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-md shadow-md">
                <div>
                    <label className="block text-gray-700">Nom d'utilisateur</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="mt-2 p-2 w-full border border-gray-300 rounded-md"
                        required
                    />
                </div>
                <div className="mt-4">
                    <label className="block text-gray-700">Contenu du post</label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="mt-2 p-2 w-full border border-gray-300 rounded-md"
                        rows={4}
                        required
                    ></textarea>
                </div>
                <button type="submit" className="mt-4 bg-blue-600 text-white p-2 rounded-md">
                    Publier
                </button>
            </form>
        </div>
    );
};

export default PostForm;
