// src/screens/Login.tsx
import React, {useState} from 'react';
import {useUser} from '../Context/UserContext';
import {useNavigate} from 'react-router-dom';

const Login: React.FC = () => {
    const {login} = useUser(); // Récupération de la fonction login depuis le UserContext
    const [email, setEmail] = useState(''); // Initialisation de l'état pour gérer l'email
    const [password, setPassword] = useState(''); // Initialisation de l'état pour gérer le mot de passe
    const navigate = useNavigate(); // Initialisation de la fonction de navigation pour rediriger après une connexion réussie

    const handleLogin = async (e: React.FormEvent) => { // Fonction pour gérer la connexion
        e.preventDefault(); // Empêche le comportement par défaut du formulaire
        try {
            await login(email, password); // Appel de la fonction login avec l'email et le mot de passe
            navigate('/home'); // Si la connexion est réussie, redirection vers la page d'accueil
        } catch (error) {
            console.error('Erreur lors de la connexion', error); // Affichage d'une erreur dans la console si la connexion échoue
            alert('Échec de la connexion, veuillez réessayer.'); // Alerte à l'utilisateur en cas d'échec de la connexion
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-semibold text-center mb-6">Se connecter</h2>
                <form onSubmit={handleLogin}>
                    {/* Formulaire qui appelle handleLogin lors de la soumission */}
                    <div className="mb-4">
                        {/* Wrapper pour le champ de saisie de l'email */}
                        <label htmlFor="email" className="block text-gray-700">Email</label>
                        <input
                            id="email"
                            type="email"
                            value={email} // La valeur du champ email est liée à l'état email
                            onChange={(e) => setEmail(e.target.value)} // Mise à jour de l'état email à chaque saisie
                            className="w-full p-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Entrez votre email"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        {/* Wrapper pour le champ de saisie du mot de passe */}
                        <label htmlFor="password" className="block text-gray-700">Mot de passe</label>
                        <input
                            id="password"
                            type="password"
                            value={password} // La valeur du champ mot de passe est liée à l'état password
                            onChange={(e) => setPassword(e.target.value)} // Mise à jour de l'état password à chaque saisie
                            className="w-full p-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Entrez votre mot de passe"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Se connecter
                    </button>
                    {/* Bouton de soumission pour la connexion */}
                </form>
                <p className="mt-4 text-center">
                    {/* Texte et lien pour l'inscription */}
                    Pas encore de compte? <a href="/register" className="text-blue-600">S'inscrire</a>
                </p>
            </div>
        </div>
    );
};

export default Login;