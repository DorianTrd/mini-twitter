// src/context/UserContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
    id: number;
    name: string;
    email: string;
}

interface UserContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
    followUser: (userId: number) => Promise<void>;
    unfollowUser: (userId: number) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
    children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const navigate = useNavigate();

    const isAuthenticated = !!localStorage.getItem('token');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {

        }
    }, []);

    const login = async (email: string, password: string) => {
        const response = await fetch('http://localhost:5000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('token', data.token); // Stocker le token
            setUser(data.user); // Stocker l'utilisateur
            navigate('/home'); // Redirection vers la page d'accueil
        } else {
            alert('Email ou mot de passe incorrect');
        }
    };

    const register = async (name: string, email: string, password: string) => {
        const response = await fetch('http://localhost:5000/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password }),
        });

        if (response.ok) {
            alert('Inscription réussie ! Vous pouvez maintenant vous connecter');
            navigate('/login');
        } else {
            alert('Erreur lors de l\'inscription');
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        navigate('/login');
    };

    const followUser = async (userId: number) => {
        const response = await fetch('http://localhost:5000/api/follow', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({ userId }),
        });

        if (response.ok) {
            alert('Vous suivez maintenant cet utilisateur');
        } else {
            alert('Erreur lors du suivi');
        }
    };

    const unfollowUser = async (userId: number) => {
        const response = await fetch('http://localhost:5000/api/unfollow', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({ userId }),
        });

        if (response.ok) {
            alert('Vous ne suivez plus cet utilisateur');
        } else {
            alert('Erreur lors de l\'annulation du suivi');
        }
    };

    return (
        <UserContext.Provider value={{ user, login, register, logout, isAuthenticated, followUser, unfollowUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = (): UserContextType => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};
