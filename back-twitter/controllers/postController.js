const {Post} = require('../models/');
const {User} = require('../models/');



exports.createPost = async (req, res) => {
    try {
        console.log("Fichier reçu :", req.file);

        const { title } = req.body;
        if (!title || !req.file) {
            return res.status(400).json({ error: 'Tous les champs sont requis' });
        }

        // Convertir le Blob en Base64
        const imgBase64 = req.file.buffer.toString('base64');

        const userId = req.user.id;

        const newPost = await Post.create({
            title,
            img: imgBase64,
            userId
        });

        res.status(201).json(newPost);
    } catch (error) {
        console.error("Erreur lors de la création du post :", error);
        res.status(500).json({ error: "Erreur serveur" });
    }
};


// Supprimer un post
exports.deletePost = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await Post.findByPk(id);
        if (!post) {
            return res.status(404).json({ error: 'Post non trouvé' });
        }
        await post.destroy();
        res.status(200).json({ message: 'Post supprimé avec succès' });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la suppression du post' });
    }
};

// Récupérer un post par ID
exports.getPost = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await Post.findByPk(id);

        if (!post) {
            return res.status(404).json({ error: 'Post non trouvé' });
        }

        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération du post' });
    }
};
//Récupère tout les postes d'un utilisateur

exports.getCurrentUserPosts = async (req, res) => {
    try {
        const userId = req.user.id;

        // Récupérer les posts et les informations de l'utilisateur en une seule requête
        const posts = await Post.findAll({
            where: { userId },
            include: [{
                model: User,
                as: 'author',
                attributes: ['id', 'name'],
            }],
            order: [['createdAt', 'ASC']],
        });

        // Retourner les posts avec les informations de l'auteur
        res.status(200).json(posts);
    } catch (error) {
        console.error("Erreur lors de la récupération des posts de l'utilisateur :", error);
        res.status(500).json({
            error: "Erreur lors de la récupération des posts de l'utilisateur.",
        });
    }
};


// Récupérer tous les posts
exports.getAllPosts = async (req, res) => {
    try {
        const posts = await Post.findAll({
            include: [{
                model: User,
                as: "author", // Associer l'auteur du post via userId
                attributes: ["id", "name"], // Récupère l'ID et le nom de l'auteur
            }],
        });

        res.status(200).json(posts);
    } catch (error) {
        console.error("Erreur lors de la récupération des posts", error);
        res.status(500).json({ error: 'Erreur lors de la récupération des posts' });
    }
};
// Récupérer tous les posts d'un utilisateur par son ID
exports.getPostsByUserId = async (req, res) => {
    try {
        const { id } = req.params;  // Récupérer l'ID de l'utilisateur depuis les paramètres de l'URL

        // Récupérer tous les posts de cet utilisateur
        const posts = await Post.findAll({
            where: { userId: id },  // Filtrer par userId
            include: [{
                model: User,
                as: 'author',  // Joindre les informations de l'utilisateur auteur du post
                attributes: ['id', 'name'],  // Récupérer l'ID et le nom de l'auteur
            }],
            order: [['createdAt', 'ASC']],  // Tri des posts par date de création
        });

        // Vérifier si l'utilisateur a des posts
        if (posts.length === 0) {
            return res.status(404).json({ error: 'Aucun post trouvé pour cet utilisateur' });
        }

        // Retourner les posts de l'utilisateur
        res.status(200).json(posts);
    } catch (error) {
        console.error("Erreur lors de la récupération des posts de l'utilisateur :", error);
        res.status(500).json({ error: 'Erreur lors de la récupération des posts' });
    }
};
