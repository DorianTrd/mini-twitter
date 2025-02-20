const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {User} = require('../models/index');
require('dotenv').config();

exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Tous les champs sont requis' });
        }

        // Vérifier si l'utilisateur existe déjà
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'Email déjà utilisé' });
        }

        // Hachage du mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Création de l'utilisateur
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword
        });

        return res.status(201).json({ message: 'Utilisateur créé avec succès', user: newUser });
    } catch (error) {
        console.error('Erreur lors de l\'inscription:', error);
        return res.status(500).json({ message: 'Erreur serveur' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email et mot de passe requis' });
        }

         const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        // Vérifier le mot de passe
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Mot de passe incorrect' });
        }

        // Génération du token JWT
        const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, { expiresIn: '24h' });

        return res.status(200).json({ message: 'Connexion réussie', token, user });
    } catch (error) {
        console.error('Erreur lors de la connexion:', error);
        return res.status(500).json({ message: 'Erreur serveur' });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        if (!users.length) {
            return res.status(404).json({ message: 'Aucun utilisateur trouvé' });
        }
        return res.status(200).json(users);
    } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs:', error);
        return res.status(500).json({ message: 'Erreur serveur' });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        return res.status(200).json(user);
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'utilisateur:', error);
        return res.status(500).json({ message: 'Erreur serveur' });
    }
};


exports.updateUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const user = await User.findByPk(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }


        if (name) user.name = name;
        if (email) user.email = email;
        if (password) user.password = await bcrypt.hash(password, 10);

        await user.save();

        return res.status(200).json({ message: 'Utilisateur mis à jour avec succès', user });
    } catch (error) {
        console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
        return res.status(500).json({ message: 'Erreur serveur' });
    }
};


exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        await user.destroy();

        return res.status(200).json({ message: 'Utilisateur supprimé avec succès' });
    } catch (error) {
        console.error('Erreur lors de la suppression de l\'utilisateur:', error);
        return res.status(500).json({ message: 'Erreur serveur' });
    }
};
exports.getCurrentUser = async (req, res) => {
    console.log("Utilisateur reçu dans req.user:", req.user);

    if (!req.user) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    res.json({
        id: req.user.id,
        name: req.user.name,  // Assure-toi que username existe bien en base de données
    });
};

