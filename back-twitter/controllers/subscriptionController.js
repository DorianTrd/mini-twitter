const { User, Subscription } = require("../models")


//abonne l'utilisateur vers un autre utlisateur
exports.subscribe = async (req, res) => {
    try {
        const { subscribedToId } = req.body
        const subscriberId = req.user.id

        if (subscriberId === subscribedToId) {
            return res.status(400).json({ message: "Vous ne pouvez pas vous abonner à vous-même" })
        }

        const [subscription, created] = await Subscription.findOrCreate({
            where: { subscriberId, subscribedToId },
        })

        if (!created) {
            return res.status(400).json({ message: "Vous êtes déjà abonné à cet utilisateur" })
        }

        res.status(201).json({ message: "Abonnement réussi" })
    } catch (error) {
        console.error("Erreur lors de l'abonnement:", error)
        res.status(500).json({ message: "Erreur serveur" })
    }
}

//desabonne l'utilisateur vers un autre utlisateur
exports.unsubscribe = async (req, res) => {
    try {
        const { subscribedToId } = req.body
        const subscriberId = req.user.id

        const deleted = await Subscription.destroy({
            where: { subscriberId, subscribedToId },
        })

        if (!deleted) {
            return res.status(400).json({ message: "Vous n'étiez pas abonné à cet utilisateur" })
        }

        res.status(200).json({ message: "Désabonnement réussi" })
    } catch (error) {
        console.error("Erreur lors du désabonnement:", error)
        res.status(500).json({ message: "Erreur serveur" })
    }
}

//verifie si la personne est deja abonnée
exports.checkSubscription = async (req, res) => {
    try {
        const { id } = req.params
        const subscriberId = req.user.id

        const subscription = await Subscription.findOne({
            where: { subscriberId, subscribedToId: id },
        })

        res.status(200).json({ isSubscribed: !!subscription })
    } catch (error) {
        console.error("Erreur lors de la vérification de l'abonnement:", error)
        res.status(500).json({ message: "Erreur serveur" })
    }
}

