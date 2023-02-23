//-----User Models-----

// Import the necessary modules
const mongoose = require('mongoose');

//Improves error messages when validating unique data, pre-validate information before saving
const uniqueValidator = require('mongoose-unique-validator');

// New mongoose schema for a user
const userSchema = mongoose.Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true}
});

//Plugin ensures that two users can not share the same email address
userSchema.plugin(uniqueValidator);

// Export the mongoose model for the user schema
module.exports = mongoose.model('User', userSchema);

//-----End------