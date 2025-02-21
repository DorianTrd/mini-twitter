const {Post} = require('../models/');
const {User} = require('../models/');


exports.createPost = async (req, res) => {
    try {
        console.log("Fichier reçu :", req.file);

        const { title } = req.body;
        if (!title || !req.file) {
            return res.status(400).json({ error: 'Tous les champs sont requis' });
        }

        const userId = req.user.id;

        // URL de l'image
        const imgUrl = `http://localhost:5000/uploads/${req.file.filename}`;

        // Créer un post avec l'URL de l'image
        const newPost = await Post.create({
            title,
            img: imgUrl, // On stocke l'URL de l'image dans la base de données
            userId
        });

        res.status(201).json(newPost); // Retourne le post avec l'URL de l'image
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

// Récupérer tous les posts
exports.getAllPosts = async (req, res) => {
    try {
        const posts = await Post.findAll({
            include: [{
                model: User,
                as: "author",
                attributes: ["id", "name"],
            }],
            order: [['createdAt', 'DESC']] // Trier par date de création (du plus récent au plus ancien)
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
        const { id } = req.params;

        const posts = await Post.findAll({
            where: { userId: id },
            include: [{
                model: User,
                as: 'author',
                attributes: ['id', 'name'],
            }],
            order: [['createdAt', 'DESC']] // Trier du plus récent au plus ancien
        });

        if (posts.length === 0) {
            return res.status(404).json({ error: 'Aucun post trouvé pour cet utilisateur' });
        }

        res.status(200).json(posts);
    } catch (error) {
        console.error("Erreur lors de la récupération des posts de l'utilisateur :", error);
        res.status(500).json({ error: 'Erreur lors de la récupération des posts' });
    }
};
