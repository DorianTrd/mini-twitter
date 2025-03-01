const { DataTypes } = require("sequelize")
const sequelize = require("../config/db")
const User = require("./user")

const Subscription = sequelize.define(
    "Subscription",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        subscriberId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User,
                key: "id",
            },
        },
        subscribedToId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User,
                key: "id",
            },
        },
    },
    {
        tableName: "subscriptions",
        timestamps: true,
    },
)

module.exports = Subscription

