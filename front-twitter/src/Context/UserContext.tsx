import React, {createContext, useContext, useState, useEffect, ReactNode} from 'react';
import {useNavigate} from 'react-router-dom';

// Définition de l'interface User pour décrire un utilisateur
interface User {
    id: number;
    name: string;
    email: string;
}

// Définition des méthodes et états dans le contexte utilisateur
interface UserContextType {
    user: User | null; // Utilisateur connecté ou null
    login: (email: string, password: string) => Promise<void>; // Méthode pour se connecter
    register: (name: string, email: string, password: string) => Promise<void>; // Méthode pour s'inscrire
    logout: () => void; // Méthode pour se déconnecter
    isAuthenticated: boolean; // Indicateur de l'authentification (basé sur la présence du token)
    loading: boolean; // État de chargement pour vérifier l'authentification
    followUser: (userId: number) => Promise<void>; // Méthode pour suivre un utilisateur
    unfollowUser: (userId: number) => Promise<void>; // Méthode pour ne plus suivre un utilisateur
}

// Création du contexte utilisateur
const UserContext = createContext<UserContextType | undefined>(undefined);

// Définition des props pour le provider qui contiendra tous les états et méthodes
interface UserProviderProps {
    children: ReactNode;
}

// Le composant UserProvider va fournir les valeurs du contexte aux autres composants
export const UserProvider: React.FC<UserProviderProps> = ({children}) => {
    const [user, setUser] = useState<User | null>(null); // État de l'utilisateur connecté
    const [loading, setLoading] = useState(true);  // Initialisation de l'état de chargement
    const navigate = useNavigate(); // Pour la redirection après l'authentification

    // Détection de l'authentification (vérifie si un token est stocké)
    const isAuthenticated = !!localStorage.getItem('token');

    useEffect(() => {
        // Vérification de l'authentification dès le montage du composant
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const response = await fetch('http://localhost:5000/api/user', {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    });

                    // Si la réponse est valide, on récupère l'utilisateur
                    if (response.ok) {
                        const userData = await response.json();
                        setUser(userData);
                    } else {
                        localStorage.removeItem('token');
                    }
                } catch (error) {
                    console.error('Erreur lors de la vérification de l\'utilisateur', error);
                    localStorage.removeItem('token');
                }
            }
            setLoading(false);  // Fin de la vérification, on change l'état de chargement
        };

        checkAuth();
    }, []); // Le tableau vide signifie que l'effet s'exécute une seule fois au montage

    // Fonction de login
    const login = async (email: string, password: string) => {
        const response = await fetch('http://localhost:5000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({email, password}),
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('token', data.token);  // Sauvegarde le token dans le stockage local
            setUser(data.user);  // Sauvegarde les données de l'utilisateur
            navigate('/home');  // Redirige vers la page d'accueil
        } else {
            alert('Email ou mot de passe incorrect');
        }
    };

    // Fonction d'inscription
    const register = async (name: string, email: string, password: string) => {
        const response = await fetch('http://localhost:5000/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({name, email, password}),
        });

        if (response.ok) {
            alert('Inscription réussie ! Vous pouvez maintenant vous connecter');
            navigate('/login');
        } else {
            alert('Erreur lors de l\'inscription');
        }
    };

    // Fonction de logout
    const logout = () => {
        localStorage.removeItem('token');  // Retire le token du stockage local
        setUser(null);  // Réinitialise l'utilisateur
        navigate('/login');  // Redirige vers la page de login
    };

    // Fonction pour suivre un utilisateur
    const followUser = async (userId: number) => {
        const response = await fetch('http://localhost:5000/api/follow', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({userId}),
        });

        if (response.ok) {
            alert('Vous suivez maintenant cet utilisateur');
        } else {
            alert('Erreur lors du suivi');
        }
    };

    // Fonction pour ne plus suivre un utilisateur
    const unfollowUser = async (userId: number) => {
        const response = await fetch('http://localhost:5000/api/unfollow', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({userId}),
        });

        if (response.ok) {
            alert('Vous ne suivez plus cet utilisateur');
        } else {
            alert('Erreur lors de l\'annulation du suivi');
        }
    };

    return (
        <UserContext.Provider value={{
            user, login, register, logout, isAuthenticated, loading, followUser, unfollowUser
        }}>
            {loading ?
                <div>Chargement...</div> : children} {/* Affiche "Chargement..." tant que l'utilisateur n'est pas authentifié */}
        </UserContext.Provider>
    );
};

// Hook personnalisé pour accéder facilement aux valeurs du contexte
export const useUser = (): UserContextType => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};
