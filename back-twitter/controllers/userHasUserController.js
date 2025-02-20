const UserHasUser = require('../models/userHasUser');

// Un utilisateur suit un autre utilisateur
exports.followUser = async (req, res) => {
    try {
        const { followerId, followingId } = req.body;

        // Vérification pour éviter l'auto-follow
        if (followerId === followingId) {
            return res.status(400).json({ error: 'Un utilisateur ne peut pas se suivre lui-même' });
        }

        await UserHasUser.create({ followerId, followingId });
        res.status(201).json({ message: `Utilisateur ${followerId} suit ${followingId}` });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors du follow' });
    }
};

// Un utilisateur arrête de suivre un autre utilisateur
exports.unfollowUser = async (req, res) => {
    try {
        const { followerId, followingId } = req.body;

        const relation = await UserHasUser.findOne({ where: { followerId, followingId } });
        if (!relation) {
            return res.status(404).json({ error: 'Relation non trouvée' });
        }

        await relation.destroy();
        res.status(200).json({ message: `Utilisateur ${followerId} ne suit plus ${followingId}` });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de l’unfollow' });
    }
};