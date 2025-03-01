import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import PostList from "../components/PostList"
import { useUser } from "../Context/UserContext"

interface Post {
    id: number
    title: string
    img: string
    createdAt: string
    userId: number
    author: {
        id: number
        name: string
    }
}

interface ProfileUser {
    id: number
    name: string
    email: string
}

function UserProfile() {
    const { id } = useParams()
    const [posts, setPosts] = useState<Post[]>([])
    const [loading, setLoading] = useState(true)
    const [notFound, setNotFound] = useState(false)
    const [profileUser, setProfileUser] = useState<ProfileUser | null>(null)
    const [isSubscribed, setIsSubscribed] = useState(false)
    const navigate = useNavigate()
    const { user } = useUser()

    useEffect(() => {
        if (!id) return

        const fetchUserAndPosts = async () => {
            setLoading(true)
            try {
                // Fetch user profile
                const userResponse = await fetch(`http://localhost:5000/api/users/${id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                })

                if (!userResponse.ok) {
                    setNotFound(true)
                    throw new Error("Utilisateur non trouvé")
                }

                const userData: ProfileUser = await userResponse.json()
                setProfileUser(userData)

                // Fetch user's posts
                const postsResponse = await fetch(`http://localhost:5000/api/posts/user/${id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                })

                if (!postsResponse.ok) {
                    throw new Error("Erreur lors de la récupération des posts")
                }

                const postsData: Post[] = await postsResponse.json()
                setPosts(postsData)

                // Check if the current user is subscribed to this profile
                if (user && user.id !== Number.parseInt(id)) {
                    const subscriptionResponse = await fetch(`http://localhost:5000/api/subscriptions/check/${id}`, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    })

                    if (subscriptionResponse.ok) {
                        const { isSubscribed } = await subscriptionResponse.json()
                        setIsSubscribed(isSubscribed)
                    }
                }
            } catch (error) {
                console.error("Erreur lors de la récupération des données", error)
                setNotFound(true)
            } finally {
                setLoading(false)
            }
        }

        fetchUserAndPosts()
    }, [id, user])

    const handleSubscribe = async () => {
        if (!user || !profileUser) return

        try {
            const subscriptionResponse = await fetch(
                `http://localhost:5000/api/subscriptions/${isSubscribed ? "unsubscribe" : "subscribe"}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                    body: JSON.stringify({ subscribedToId: profileUser.id }),
                },
            )

            if (subscriptionResponse.ok) {
                setIsSubscribed(!isSubscribed)
            } else {
                console.error("Erreur lors de l'abonnement/désabonnement")
            }
        } catch (error) {
            console.error("Erreur lors de l'abonnement/désabonnement", error)
        }
    }

    if (loading) {
        return <div className="text-center mt-8">Chargement...</div>
    }

    if (notFound) {
        return <div className="text-center mt-8">Utilisateur non trouvé ou pas de publications disponibles.</div>
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-8">
            <div className="container mx-auto">
                <button
                    onClick={() => navigate("/home")}
                    className="mb-4 py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                    Retour à l'accueil
                </button>

                {profileUser && (
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <h2 className="text-2xl font-bold mb-2">{profileUser.name}</h2>
                        <p className="text-gray-600 mb-4">{profileUser.email}</p>
                        {user && user.id !== profileUser.id && (
                            <button
                                onClick={handleSubscribe}
                                className={`py-2 px-4 rounded-lg ${
                                    isSubscribed ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
                                } text-white`}
                            >
                                {isSubscribed ? "Se désabonner" : "S'abonner"}
                            </button>
                        )}
                    </div>
                )}

                <h3 className="text-xl font-semibold text-white mb-6">Publications</h3>
                <PostList posts={posts} />
            </div>
        </div>
    )
}

export default UserProfile

