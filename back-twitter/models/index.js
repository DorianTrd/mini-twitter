const User = require("./user")
const Post = require("./post")
const Notification = require("./notification")
const Subscription = require("./subscription")
const sequelize = require("../config/db")

Post.belongsTo(User, { foreignKey: "userId", as: "author" })
User.hasMany(Post, { foreignKey: "userId", as: "posts" })

User.hasMany(Notification, { foreignKey: "userId", as: "Notification" })
Notification.belongsTo(User, { foreignKey: "userId", as: "User" })

User.belongsToMany(User, { through: Subscription, as: "Subscribers", foreignKey: "subscribedToId" })
User.belongsToMany(User, { through: Subscription, as: "Subscriptions", foreignKey: "subscriberId" })

module.exports = { User, Post, Notification, Subscription, sequelize }

