const Sauce = require('../models/sauce');
const fs = require('fs');

exports.createSauce = (req, res) => {
    req.body.sauce = JSON.parse(req.body.sauce);
    const url = req.protocol + '://' + req.get('host');
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
    sauce.save().then(() => {
        res.status(201).json({
            message: 'Post saved successfully!'
        });
    }).catch((error) => {
        console.error(error);
        res.status(400).json({
            error: error
        });
    });
};

exports.getOneSauce = (req, res) => {
    Sauce.findOne({
        _id: req.params.id
    }).then((sauce) => {
        res.status(200).json(sauce);
    }).catch((error) => {
        res.status(404).json({
            error: error
        });
    });
};

exports.modifySauce = (req, res) => {
    let sauce = new Sauce({_id: req.params._id});
    if (req.file) {
        Sauce.findOne({_id: req.params.id}).then((sauce_replace) => {
            const filename = sauce_replace.imageUrl.split('/images/')[1];
            fs.unlink('images/' + filename, () => {
                console.log(`${filename} deleted`);
            });
        });
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

exports.deleteSauce = (req, res) => {
    Sauce.findOne({_id: req.params.id}).then((sauce) => {
        if (!sauce) {
            return res.status(404).json({
                error: new Error('Could not find sauce')
            });
        }
        if (sauce.userId !== req.auth.userId) {
            return res.status(401).json({
                error: new Error('Request not authorized')
            });
        }
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink('images/' + filename, () => {
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

exports.getAllSauces = (req, res) => {
    Sauce.find().then((sauces) => {
        res.status(200).json(sauces);
    }).catch((error) => {
        res.status(400).json({
            error: error
        });
    });
};

exports.likeSauce = (req, res) => {
    Sauce.findOne({_id: req.params.id}).then((sauce) => {
        const userStr = req.body.userId;
        const userLike = req.body.like;

        function spliceArray(usr, usrArr) {
            if (usrArr.includes(usr) === true) {
                usrArr.splice(usrArr.indexOf(usr), 1);
            }
        }

        if (userLike === 0) {
            if (sauce.usersLiked.includes(userStr) === true) {
                spliceArray(userStr, sauce.usersLiked);
            } else {
                if (sauce.usersDisliked.includes(userStr) === true) {
                    spliceArray(userStr, sauce.usersDisliked);
                }
            }
        } else if (userLike === 1) {
            if (sauce.usersDisliked.includes(userStr) === true) {
                spliceArray(userStr, sauce.usersDisliked);
            }
            if (sauce.usersLiked.includes(userStr) === false) {
                sauce.usersLiked.push(userStr);
            }
        } else {
            if (sauce.usersLiked.includes(userStr) === true) {
                spliceArray(userString, sauce.usersLiked);
            }
            if (sauce.usersDisliked.includes(userStr) === false) {
                sauce.usersDisliked.push(userStr);
            }
        }
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