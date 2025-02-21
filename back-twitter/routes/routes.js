const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const userController = require('../controllers/userController');
const followController = require('../controllers/userHasUserController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

router.post('/register', userController.register); // Inscription
router.post('/login', userController.login); // Connexion

router.get('/user', authMiddleware, userController.getCurrentUser); // Obtenir l'utilisateur connecté

router.get('/users', authMiddleware, userController.getAllUsers); // Obtenir tous les utilisateurs
router.get('/users/:id', authMiddleware, userController.getUserById); // Obtenir un utilisateur par ID
router.put('/users', authMiddleware, userController.updateUser); // Modifier son profil
router.delete('/users', authMiddleware, userController.deleteUser); // Supprimer son compte


router.get('/posts',authMiddleware, postController.getAllPosts); // Récupérer tous les posts
router.get('/posts/:id',authMiddleware, postController.getPost); // Récupérer un post par ID
router.post("/posts", authMiddleware, upload.single("img"), postController.createPost);
router.delete('/posts/:id', authMiddleware, postController.deletePost); // Supprimer un post
router.get('/posts/user/:id',authMiddleware, postController.getPostsByUserId);// Route pour récupérer les posts d'un utilisateur par son ID

router.post('/upload',authMiddleware, upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('Aucun fichier n\'a été téléchargé.');
    }
    // Retourne l'URL du fichier téléchargé
    res.send({ url: `http://localhost:5000/uploads/${req.file.filename}` });
});

module.exports = router;
