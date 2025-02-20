const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./config/db');
const routes = require('./routes/routes');
const User = require('./models/user');  // Assurez-vous que le chemin est correct
const Post = require('./models/post');  // Assurez-vous que le chemin est correct

const app = express();

// Configuration CORS
app.use(cors({
    origin: 'http://localhost:5173', // Remplace par l'URL de ton frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'] // Assurez-vous que l'en-tête Authorization est autorisé
}));


app.use(bodyParser.json());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Routes
app.use('/api', routes);


sequelize.sync()
    .then(() => {
        app.listen(5000, () => {
            console.log('Server running on http://localhost:5000');
        });
    })
    .catch((err) => {
        console.error('Error syncing the database:', err);
    });
