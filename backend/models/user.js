const mongoose = require('mongoose');

//Improves error messages when validating unique data, pre-validate information before saving
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true}
});

//Plugin ensure that no two users can share the same email address
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);