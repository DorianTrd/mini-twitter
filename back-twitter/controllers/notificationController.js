const webpush = require("../utils/webpush")

// Stockage temporaire des abonnements
const subscriptions = new Map()

// Enregistrer un nouvel abonnement aux notifications
exports.subscribe = async (req, res) => {
    try {
        const { subscription, userId } = req.body

        if (!subscription || !userId) {
            return res.status(400).json({ error: "Données d'abonnement ou ID utilisateur manquants" })
        }

        // Stocker l'abonnement avec l'ID utilisateur
        subscriptions.set(userId.toString(), subscription)

        console.log(`Utilisateur ${userId} abonné aux notifications`)

        res.status(201).json({ message: "Abonnement enregistré avec succès" })
    } catch (error) {
        console.error("Erreur lors de l'enregistrement de l'abonnement:", error)
        res.status(500).json({ error: "Erreur serveur" })
    }
}

// Se désabonner des notifications
exports.unsubscribe = async (req, res) => {
    try {
        const { userId } = req.body

        if (!userId) {
            return res.status(400).json({ error: "ID utilisateur manquant" })
        }

        // Supprimer l'abonnement
        subscriptions.delete(userId.toString())

        console.log(`Utilisateur ${userId} désabonné des notifications`)

        res.status(200).json({ message: "Désabonnement effectué avec succès" })
    } catch (error) {
        console.error("Erreur lors du désabonnement:", error)
        res.status(500).json({ error: "Erreur serveur" })
    }
}

// Envoyer une notification à un utilisateur spécifique
exports.sendNotification = async (req, res) => {
    try {
        const { userId, title, body, icon, url } = req.body

        if (!userId || !title || !body) {
            return res.status(400).json({ error: "Données de notification incomplètes" })
        }

        const subscription = subscriptions.get(userId.toString())

        if (!subscription) {
            return res.status(404).json({ error: "Aucun abonnement trouvé pour cet utilisateur" })
        }

        // Création du payload de la notification
        const payload = JSON.stringify({
            title,
            body,
            icon: icon || "/icons/icon_144.png",
            url: url || "/",
            timestamp: new Date().getTime(),
        })

        // Envoi de la notification
        await webpush.sendNotification(subscription, payload)

        console.log(`Notification envoyée à l'utilisateur ${userId}`)

        res.status(200).json({ message: "Notification envoyée avec succès" })
    } catch (error) {
        console.error("Erreur lors de l'envoi de la notification:", error)
        res.status(500).json({ error: "Erreur serveur" })
    }
}

// Fonction utilitaire pour envoyer une notification depuis d'autres contrôleurs
exports.notifyUser = async (userId, title, body, icon, url) => {
    try {
        const subscription = subscriptions.get(userId.toString())

        if (!subscription) {
            console.log(`Aucun abonnement trouvé pour l'utilisateur ${userId}`)
            return false
        }

        const payload = JSON.stringify({
            title,
            body,
            icon: icon || "/icons/icon_144.png",
            url: url || "/",
            timestamp: new Date().getTime(),
        })

        await webpush.sendNotification(subscription, payload)
        console.log(`Notification envoyée à l'utilisateur ${userId}`)
        return true
    } catch (error) {
        console.error("Erreur lors de l'envoi de la notification:", error)
        return false
    }
}

