import type React from "react"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useNavigate } from "react-router-dom"

// Interface représentant un utilisateur
interface User {
    id: number
    name: string
    email: string
}

// Interface pour le contexte utilisateur
interface UserContextType {
    user: User | null
    login: (email: string, password: string) => Promise<void>
    register: (name: string, email: string, password: string) => Promise<void>
    logout: () => void
    isAuthenticated: boolean
    loading: boolean
}

const UserContext = createContext<UserContextType | undefined>(undefined)

interface UserProviderProps {
    children: ReactNode
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    // Vérifie si un token est présent dans le localStorage
    const isAuthenticated = !!localStorage.getItem("token")

    // Vérification de l'authentification de l'utilisateur au chargement
    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem("token")
            if (token) {
                try {
                    const response = await fetch("http://localhost:5000/api/user", {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    })

                    if (response.ok) {
                        const userData = await response.json()
                        setUser(userData) // Met à jour l'état utilisateur
                    } else {
                        localStorage.removeItem("token") // Supprime le token en cas d'échec
                    }
                } catch (error) {
                    console.error("Erreur lors de la vérification de l'utilisateur", error)
                    localStorage.removeItem("token")
                }
            }
            setLoading(false)
        }

        checkAuth()
    }, [])

    // Fonction de connexion
    const login = async (email: string, password: string) => {
        const response = await fetch("http://localhost:5000/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        })

        if (response.ok) {
            const data = await response.json()
            localStorage.setItem("token", data.token) // Stocke le token
            setUser(data.user) // Met à jour l'utilisateur connecté
            navigate("/home") // Redirige vers la page d'accueil
        } else {
            alert("Email ou mot de passe incorrect")
        }
    }

    // Fonction d'inscription
    const register = async (name: string, email: string, password: string) => {
        const response = await fetch("http://localhost:5000/api/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, email, password }),
        })

        if (response.ok) {
            alert("Inscription réussie ! Vous pouvez maintenant vous connecter")
            navigate("/login") // Redirige vers la page de connexion
        } else {
            alert("Erreur lors de l'inscription")
        }
    }

    // Fonction de déconnexion
    const logout = () => {
        localStorage.removeItem("token") // Supprime le token
        setUser(null) // Réinitialise l'état utilisateur
        navigate("/login") // Redirige vers la page de connexion
    }

    return (
        <UserContext.Provider
            value={{
                user,
                login,
                register,
                logout,
                isAuthenticated,
                loading,
            }}
        >
            {loading ? <div>Chargement...</div> : children}
        </UserContext.Provider>
    )
}

// Hook personnalisé pour accéder au contexte utilisateur
export const useUser = (): UserContextType => {
    const context = useContext(UserContext)
    if (!context) {
        throw new Error("useUser must be used within a UserProvider")
    }
    return context
}
