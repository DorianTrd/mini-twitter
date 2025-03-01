import type React from "react"
import { useState, useEffect } from "react"
import { useUser } from "../Context/UserContext"

//clé public pour les notifications
const VAPID_PUBLIC_KEY = "BJnkICy5p4uSAONoZTznxYTHlNZ9RVF9vrJp6SS_MTIbczNmMq4rt_SrRq2WoBBWwWunfNZjgSNHsAwBdvb3fDo"

// Fonction pour convertir une clé VAPID en Uint8Array
function urlBase64ToUint8Array(base64String: string) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
    const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/")
    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
}

const NotificationManager: React.FC = () => {
    const { user } = useUser()
    const [isSubscribed, setIsSubscribed] = useState<boolean>(false)
    const [isSupported, setIsSupported] = useState<boolean>(false)
    const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null)

    // Vérification du support des notifications push et enregistrement du service worker
    useEffect(() => {
        if ("serviceWorker" in navigator && "PushManager" in window && "Notification" in window) {
            setIsSupported(true)

            navigator.serviceWorker.ready.then((reg) => {
                setRegistration(reg)

                reg.pushManager.getSubscription().then((subscription) => {
                    setIsSubscribed(!!subscription) // Vérifie si l'utilisateur est déjà abonné
                })
            })
        }
    }, [])

    // Demande de permission pour les notifications
    const requestNotificationPermission = async () => {
        try {
            const permission = await Notification.requestPermission()
            return permission === "granted"
        } catch (error) {
            console.error("Erreur lors de la demande de permission:", error)
            return false
        }
    }

    // Abonnement aux notifications
    const subscribeToNotifications = async () => {
        try {
            if (!registration) {
                console.error("Service worker non enregistré");
                return;
            }

            const permissionGranted = await requestNotificationPermission();
            if (!permissionGranted) {
                console.log("Permission de notification refusée");
                return;
            }

            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
            });

            console.log("Abonnement créé:", subscription);

            // Enregistrement de l'abonnement sur le serveur
            if (user) {
                const response = await fetch("http://localhost:5000/api/notifications/subscribe", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                    body: JSON.stringify({
                        subscription,
                        userId: user.id,
                    }),
                });

                if (response.ok) {
                    setIsSubscribed(true);
                    console.log("Abonnement enregistré sur le serveur");
                } else {
                    console.error("Erreur lors de l'enregistrement de l'abonnement");
                }
            }
        } catch (error) {
            console.error("Erreur lors de l'abonnement aux notifications:", error);
        }
    }

    // Désabonnement des notifications
    const unsubscribeFromNotifications = async () => {
        try {
            if (!registration) {
                console.error("Service worker non enregistré")
                return
            }

            const subscription = await registration.pushManager.getSubscription()
            if (!subscription) {
                console.log("Aucun abonnement à supprimer")
                return
            }

            await subscription.unsubscribe()

            // Suppression de l'abonnement sur le serveur
            if (user) {
                const response = await fetch("http://localhost:5000/api/notifications/unsubscribe", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                    body: JSON.stringify({
                        userId: user.id,
                    }),
                })

                if (response.ok) {
                    setIsSubscribed(false)
                    console.log("Désabonnement effectué sur le serveur")
                } else {
                    console.error("Erreur lors du désabonnement sur le serveur")
                }
            }
        } catch (error) {
            console.error("Erreur lors du désabonnement:", error)
        }
    }

    // Si les notifications ne sont pas supportées
    if (!isSupported) {
        return (
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4 rounded">
                <p>Votre navigateur ne prend pas en charge les notifications push.</p>
            </div>
        )
    }

    return (
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-4">Notifications</h2>

            {isSubscribed ? (
                <div>
                    <p className="text-green-600 mb-4">Vous êtes abonné aux notifications.</p>
                    <button
                        onClick={unsubscribeFromNotifications}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                        Se désabonner
                    </button>
                </div>
            ) : (
                <div>
                    <p className="text-gray-600 mb-4">Activez les notifications pour être informé des nouveaux posts.</p>
                    <button
                        onClick={subscribeToNotifications}
                        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                    >
                        Activer les notifications
                    </button>
                </div>
            )}
        </div>
    )
}

export default NotificationManager
