const { Sequelize } = require('sequelize');


const sequelize = new Sequelize('twitter_db', 'root', '', {
    host: 'localhost',  
    dialect: 'mysql',   
});

module.exports = sequelize;
