import React from "react";
import {BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import {UserProvider} from './Context/UserContext';
import Login from './screens/Login';
import Register from './screens/Register';
import Home from './screens/Home';
import Profile from './screens/Profile';

const App: React.FC = () => { // Composant principal de l'application
    return (
        <Router>
            <UserProvider>
                <Routes>
                    {/* Redirection automatique de la route "/" vers "/login" pour diriger les utilisateurs vers la page de connexion par défaut */}
                    <Route path="/" element={<Navigate to="/login" replace/>}/>
                    {/* Route pour la page de connexion, lorsque l'utilisateur accède à "/login", le composant Login est affiché */}
                    <Route path="/login" element={<Login/>}/>
                    {/* Route pour la page d'inscription, lorsque l'utilisateur accède à "/register", le composant Register est affiché */}
                    <Route path="/register" element={<Register/>}/>
                    {/* Route pour la page d'accueil, lorsque l'utilisateur accède à "/home", le composant Home est affiché */}
                    <Route path="/home" element={<Home/>}/>
                    {/* Route pour la page de profil utilisateur avec un paramètre dynamique "id", qui affiche le composant Profile pour l'utilisateur correspondant */}
                    <Route path="/profile/:id" element={<Profile/>}/>
                </Routes>
            </UserProvider>
        </Router>
    );
};

export default App;