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


router.get('/posts', postController.getAllPosts); // Récupérer tous les posts
router.get('/posts/:id', postController.getPost); // Récupérer un post par ID
router.post("/posts", authMiddleware, upload.single("img"), postController.createPost);
router.delete('/posts/:id', authMiddleware, postController.deletePost); // Supprimer un post
router.get("/user/posts", authMiddleware, postController.getCurrentUserPosts);//Récupère tout les postes d'un utilisateur
router.get('/posts/user/:id', postController.getPostsByUserId);// Route pour récupérer les posts d'un utilisateur par son ID


module.exports = router;
