//-----Sauce realated logic------

// Imports the Sauce model, which represents the schema for the sauces collection in the database
const Sauce = require('../models/sauce');

// Imports the fs module, which provides an API for interacting with the file system
const fs = require('fs');

// This function creates a new sauce and saves it to the database
exports.createSauce = (req, res) => {
    
    // Parse the sauce object from the request body
    req.body.sauce = JSON.parse(req.body.sauce);
    
    // Generate the URL for the image file
    const url = req.protocol + '://' + req.get('host');
    
    // Create a new Sauce object with the properties from the request body and the generated URL
    const sauce = new Sauce({
        userId: req.body.sauce.userId,
        name: req.body.sauce.name,
        description: req.body.sauce.description,
        mainPepper: req.body.sauce.mainPepper,
        manufacturer: req.body.sauce.manufacturer,
        imageUrl: url + '/images/' + req.file.filename,
        heat: req.body.sauce.heat,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: []
    });
    
    // Save the new sauce object to the database
    sauce.save().then(() => {

        // If the save is successful, send a response to the client with a status of 201 
        //and a success message in JSON format
        res.status(201).json({
            message: 'Post saved successfully!'
        });
    }).catch((error) => {

        // If there is an error while saving the object, log the error to the console 
        //and send a response to the client with a status of 400 
        //and an error message in JSON format
        console.error(error);
        res.status(400).json({
            error: error
        });
    });
};

// Function gets a single sauce from the database based on its ID
exports.getOneSauce = (req, res) => {
    
    // Call the findOne method on the Sauce model with the specific ID
    Sauce.findOne({
        _id: req.params.id
    }).then((sauce) => {
        
        // If the sauce is found, send a response to the client with a status of 200
        //and the sauce object in JSON format
        res.status(200).json(sauce);
    }).catch((error) => {
        // If the sauce is not found, send a response to the client with a status of 404
        //and an error message in JSON format
        res.status(404).json({
            error: error
        });
    });
};

// Function modifies an existing sauce in the database
exports.modifySauce = (req, res) => {
    
    // Create a new Sauce object with the ID of the sauce passed in the request parameters
    let sauce = new Sauce({_id: req.params._id});
    
    // If a file is uploaded, replace the existing image file in the server
    if (req.file) {
        
        // Find the existing sauce in the database to read its image file name
        Sauce.findOne({_id: req.params.id}).then((sauce_replace) => {
            const filename = sauce_replace.imageUrl.split('/images/')[1];
            
            // Delete the existing image file from the server
            fs.unlink('images/' + filename, () => {
                console.log(`${filename} deleted`);
            });
        });

        // Build a new sauce object with the updated values
        const url = req.protocol + '://' + req.get('host');
        req.body.sauce = JSON.parse(req.body.sauce);
        sauce = {
            _id: req.params.id,
            name: req.body.sauce.name,
            description: req.body.sauce.description,
            mainPepper: req.body.sauce.mainPepper,
            manufacturer: req.body.sauce.manufacturer,
            imageUrl: url + '/images/' + req.file.filename,
            heat: req.body.sauce.heat,
            likes: req.body.sauce.likes,
            dislikes: req.body.sauce.dislikes,
            usersLiked: req.body.sauce.usersLiked,
            usersDisliked: req.body.sauce.usersDisliked,
            userId: req.body.sauce.userId
        };
    } else {
        
        // Build a new sauce object with the updated values
        sauce = {
            _id: req.params.id,
            name: req.body.name,
            description: req.body.description,
            mainPepper: req.body.mainPepper,
            manufacturer: req.body.manufacturer,
            imageUrl: req.body.imageUrl,
            heat: req.body.heat,
            likes: req.body.likes,
            dislikes: req.body.dislikes,
            usersLiked: req.body.usersLiked,
            usersDisliked: req.body.usersDisliked,
            userId: req.body.userId
        };
    }
    
    // Update the existing sauce in the database with the new sauce object
    Sauce.updateOne({_id: req.params.id}, sauce).then(() => {
        res.status(201).json({
            message: 'sauce updated successfully!'
        });
    }).catch((error) => {
        res.status(400).json({
            error: error
        });
    });
};

// Function to delete the sauce from the database
exports.deleteSauce = (req, res) => {
    
    // Find the sauce by ID
    Sauce.findOne({_id: req.params.id}).then((sauce) => {
        
        // If the sauce is not found, return error
        if (!sauce) {
            return res.status(404).json({
                error: new Error('Could not find sauce')
            });
        }

        // If the user ID authentication does not match the user ID of the sauce owner, return error
        if (sauce.userId !== req.auth.userId) {
            return res.status(401).json({
                error: new Error('Request not authorized')
            });
        }

        // Get the image name from the sauce imageUrl property
        const filename = sauce.imageUrl.split('/images/')[1];
        
        // Delete the image from the file system
        fs.unlink('images/' + filename, () => {
            
            // Delete the sauce from the database
            Sauce.deleteOne({_id: req.params.id}).then(() => {
                res.status(200).json({
                    message: 'Deleted!'
                });
            }).catch((error) => {
                res.status(400).json({
                    error: error
                });
            });
        });
    });
};

//Functiot to gets the list of items
exports.getAllSauces = (req, res) => {
    Sauce.find().then((sauces) => {
        res.status(200).json(sauces);
    }).catch((error) => {
        res.status(400).json({
            error: error
        });
    });
};

//Function for "like" and "dislike"
exports.likeSauce = (req, res) => {

    // Find the sauce by ID
    Sauce.findOne({_id: req.params.id}).then((sauce) => {
        
        //Ger user ID and likes
        const userStr = req.body.userId;
        const userLike = req.body.like;

        // Removes user ID from an array if it's present
        function spliceArray(usr, usrArr) {
            if (usrArr.includes(usr) === true) {
                usrArr.splice(usrArr.indexOf(usr), 1);
            }
        }

        // If the user set like to 0 (neutral), update the usersLiked
        // or usersDisliked array 
        if (userLike === 0) {
            if (sauce.usersLiked.includes(userStr) === true) {
                spliceArray(userStr, sauce.usersLiked);
            } else {
                if (sauce.usersDisliked.includes(userStr) === true) {
                    spliceArray(userStr, sauce.usersDisliked);
                }
            }

        // If the user set like to 1 (like), add their user ID to the
        // usersLiked array and remove from usersDisliked array if present
        } else if (userLike === 1) {
            if (sauce.usersDisliked.includes(userStr) === true) {
                spliceArray(userStr, sauce.usersDisliked);
            }
            if (sauce.usersLiked.includes(userStr) === false) {
                sauce.usersLiked.push(userStr);
            }

        // If the user set like to -1 (dislike), add their user ID to
        // the usersDisliked array and remove from usersLiked array if present
        } else {
            if (sauce.usersLiked.includes(userStr) === true) {
                spliceArray(userString, sauce.usersLiked);
            }
            if (sauce.usersDisliked.includes(userStr) === false) {
                sauce.usersDisliked.push(userStr);
            }
        }

        // Update likes and dislikes based on the updated usersLiked
        // and usersDisliked arrays, and update the sauce in the database
        sauce.likes = sauce.usersLiked.length;
        sauce.dislikes = sauce.usersDisliked.length;
        Sauce.updateOne({_id: req.params.id}, sauce).then(() => {
            res.status(200).json({
                message: 'sauce updated successfully!'
            });
        }).catch((error) => {
            res.status(400).json({
                error: error
            });
        });
    });
}; 

//-----End-----