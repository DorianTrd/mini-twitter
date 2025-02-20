const multer = require('multer');

// Configuration de stockage en mémoire pour convertir en Base64
const storage = multer.memoryStorage();
const upload = multer({ storage });

module.exports = upload;
