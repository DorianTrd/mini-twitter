// src/screens/Register.tsx
import React, {useState} from 'react';
import {useUser} from '../Context/UserContext';

const Register: React.FC = () => {
    const {register} = useUser(); // Récupération de la fonction register depuis le contexte utilisateur
    const [name, setName] = useState<string>(''); // État pour gérer le nom de l'utilisateur
    const [email, setEmail] = useState<string>(''); // État pour gérer l'email de l'utilisateur
    const [password, setPassword] = useState<string>(''); // État pour gérer le mot de passe de l'utilisateur

    const handleRegister = async (e: React.FormEvent) => { // Fonction appelée lors de la soumission du formulaire d'inscription
        e.preventDefault(); // Empêche le comportement par défaut de soumission du formulaire
        try {
            await register(name, email, password); // Appel de la fonction d'inscription avec les informations fournies par l'utilisateur
            alert('Inscription réussie ! Vous pouvez maintenant vous connecter.'); // Alerte indiquant que l'inscription a été réussie
        } catch (error) {
            console.error('Erreur lors de l\'inscription', error); // Affichage de l'erreur dans la console en cas de problème
            alert('Échec de l\'inscription, veuillez réessayer.'); // Message d'erreur si l'inscription échoue
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-semibold text-center mb-6">S'inscrire</h2>
                <form onSubmit={handleRegister}>
                    {/* Formulaire qui appelle handleRegister lors de la soumission */}
                    <div className="mb-4">
                        {/* Champ pour le nom de l'utilisateur */}
                        <label htmlFor="name" className="block text-gray-700">Nom</label>
                        <input
                            id="name"
                            type="text"
                            value={name} // La valeur du champ nom est liée à l'état name
                            onChange={(e) => setName(e.target.value)} // Mise à jour de l'état name à chaque saisie
                            className="w-full p-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Entrez votre nom"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        {/* Champ pour l'email de l'utilisateur */}
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
                        {/* Champ pour le mot de passe de l'utilisateur */}
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
                    <button type="submit"
                            className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        S'inscrire
                    </button>
                    {/* Bouton de soumission pour l'inscription */}
                </form>
                <p className="mt-4 text-center">
                    {/* Texte de lien pour rediriger l'utilisateur vers la page de connexion */}
                    Déjà un compte? <a href="/login" className="text-blue-600">Se connecter</a>
                </p>
            </div>
        </div>
    );
};

export default Register;