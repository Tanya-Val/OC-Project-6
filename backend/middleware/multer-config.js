//  Import the Multer package to use it in the application
const multer = require('multer');

// Defines an object that maps MIME types to file extensions
const MIME_TYPES = {
    'image/jpg': 'jpg', 'image/jpeg': 'jpg', 'image/png': 'png'
};

//Defines the storage options for uploaded files
const storage = multer.diskStorage({

    // Specifies the folder where the uploaded files will be stored
    destination: (req, file, callback) => {
        callback(null, 'images');
    }, filename: (req, file, callback) => {
        const extension = MIME_TYPES[file.mimetype];
        
        // Replaces any spaces in the file name with underscores
        let name = file.originalname.split(' ').join('_');
        
        //Checks if the file name already has an extension. If so, it removes the existing extension
        if (Object.values(MIME_TYPES).includes(name.split('.').pop()) === true) {
            name = name.slice(0, name.lastIndexOf('.'));
        }
        callback(null, name + '.' + Date.now() + '.' + extension);
    }
});

module.exports = multer({storage: storage}).single('image');

//-----End------