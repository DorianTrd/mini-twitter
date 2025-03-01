const webpush = require("web-push")
require("dotenv").config()

const vapidKeys = {
    publicKey: process.env.NOTIFICATION_PUBLIC_KEY,
    privateKey: process.env.NOTIFICATION_PRIVATE_KEY,
}

webpush.setVapidDetails(
    "mailto:dorian.tardieu@my-digital-school.org",
    vapidKeys.publicKey,
    vapidKeys.privateKey,
)

module.exports = webpush

