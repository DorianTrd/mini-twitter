const User = require('./user');
const Post = require('./post');
const sequelize = require("../config/db");
const UserHasUser = require('./userHasUser');

Post.belongsTo(User, { foreignKey: "userId", as: "author" });
User.hasMany(Post, { foreignKey: "userId", as: "posts" });


User.belongsToMany(User, {
    through: UserHasUser,
    as: 'Followers',
    foreignKey: 'followingId',
    otherKey: 'followerId',
});

User.belongsToMany(User, {
    through: UserHasUser,
    as: 'Following',
    foreignKey: 'followerId',
    otherKey: 'followingId',
});

module.exports = { User, Post ,UserHasUser, sequelize};