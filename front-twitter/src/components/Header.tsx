// components/Header.tsx
import React from "react";

// Définition des types pour les props
interface HeaderProps {
    user: { id: string; name: string } | null; // L'utilisateur connecté ou null
    handleLogout: () => void; // Fonction pour gérer la déconnexion
}


const Header: React.FC<HeaderProps> = ({user, handleLogout}) => {
    return (
        <nav className="flex justify-between items-center bg-white p-4 shadow-md">
            {/* Affichage du message de bienvenue ou d'un message par défaut si l'utilisateur est inconnu */}
            <h1 className="text-xl font-bold text-indigo-600">
                {user ? `Bienvenue, ${user.name} !` : "Utilisateur inconnu"}
            </h1>

            {/* Bouton de déconnexion */}
            <button
                onClick={handleLogout} // Lors du clic sur le bouton, la fonction handleLogout est appelée
                className="bg-red-500 text-white px-4 py-2 rounded"
            >
                Se Déconnecter
            </button>
        </nav>
    );
};

export default Header;
