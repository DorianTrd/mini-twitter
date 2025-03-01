const { Sequelize } = require('sequelize');

//Connexion a la BDD
const sequelize = new Sequelize('twitter_db', 'root', '', {
    host: 'localhost',  
    dialect: 'mysql',   
});

module.exports = sequelize;
