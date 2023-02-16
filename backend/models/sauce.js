const mongoose = require('mongoose');

//Data schema with the fields for each Sauce, their type, and whether or not they are a required field.
const sauceSchema = mongoose.Schema({
    userId: {type: String, required: true},
    name: {type: String, required: true},
    description: {type: String, required: true},
    manufacturer: {type: String, required: true},
    mainPepper: {type: String, required: true},
    imageUrl: {type: String, required: true},
    heat: {type: Number, required: true},
    likes: {type: Number, required: false},
    dislikes: {type: Number, required: false},
    usersLiked: {type: Array, required: false},
    usersDisliked: {type: Array, required: false}
});

//When imported, can used to query, insert, update, and delete documents in the associated collection
module.exports = mongoose.model('Sauce', sauceSchema); 