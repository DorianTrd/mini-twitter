const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./user');
const Post = require('./post');

const UserHasUser = sequelize.define('UserHasUser', {
    followerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id',
        },
    },
    followingId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id',
        },
    },
}, {
    tableName: 'user_has_users',
    timestamps: false,
});



module.exports = UserHasUser;
