const multer = require('multer');

const MIME_TYPES = {
    'image/jpg': 'jpg', 'image/jpeg': 'jpg', 'image/png': 'png'
};

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images');
    }, filename: (req, file, callback) => {
        const extension = MIME_TYPES[file.mimetype];
        let name = file.originalname.split(' ').join('_');
        if (Object.values(MIME_TYPES).includes(name.split('.').pop()) === true) {
            name = name.slice(0, name.lastIndexOf('.'));
        }
        callback(null, name + '.' + Date.now() + '.' + extension);
    }
});

module.exports = multer({storage: storage}).single('image');