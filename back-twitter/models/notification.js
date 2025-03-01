const { DataTypes } = require("sequelize");
const sequelize = require('../config/db');
const {User} = require("./index");

const Notification = sequelize.define("Notification", {
    endpoint: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    p256dh: {
        type: DataTypes.STRING,
        allowNull: false
    },
    auth: {
        type: DataTypes.STRING,
        allowNull: false
    },
    userId: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id',
        },
    },
});

module.exports = Notification;