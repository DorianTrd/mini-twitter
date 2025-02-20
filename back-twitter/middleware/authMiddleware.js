const jwt = require('jsonwebtoken');
const User = require('../models/user');

const authMiddleware = async (req, res, next) => {
    try {
        // Récupération du token dans l'en-tête
        const token = req.headers['x-access-token'] || req.headers['authorization']?.split(' ')[1];

        if (!token) {
            return res.status(403).json({ message: 'Token manquant' });
        }

        // Vérification et décodage du token
        jwt.verify(token, process.env.SECRET_KEY, async (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: 'Token invalide' });
            }

            // Recherche de l'utilisateur correspondant à l'ID du token
            const user = await User.findByPk(decoded.id);

            if (!user) {
                return res.status(404).json({ message: 'Utilisateur non trouvé' });
            }

            req.user = user; // Ajoute l'utilisateur à la requête pour l'utiliser dans les routes
            next();
        });
    } catch (error) {
        console.error('Erreur middleware auth:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

module.exports = authMiddleware;
