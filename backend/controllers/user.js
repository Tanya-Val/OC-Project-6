//-----User related logic-----

//bcrypt - Uses a one-way algorithm to encrypt and create a hash of user passwords
const bcrypt = require('bcrypt');

const User = require('../models/user');

//To create and verify authentication tokens
const jwt = require('jsonwebtoken');


//Sign up new users
exports.signup = (req, res, next) => {
    //hash()  method creates an encrypted hash of users' passwords.
    //Save them securely in the database.
    //Hash the password 10 times.
    bcrypt.hash(req.body.password, 10).then((hash) => {
        const user = new User({
            email: req.body.email, 
            password: hash
        });
        //save data to the database
        user.save().then(() => {
            res.status(201).json({
                message: 'User added successfully!'
            });
        }).catch((error) => {
            res.status(500).json({
                error: error
            });
        });
    });
};


//Login existing users
exports.login = (req, res, next) => {
    //findOne() checks if the user exists
    //Compares the email from the request body with email from database
    User.findOne({email: req.body.email}).then((user) => {
        //Return error if the user is not found
        if (!user) {
            return res.status(401).json({
                error: new Error('User not found!')
            });
        }
        //If user exists, check the password by compare password hashes
        bcrypt.compare(req.body.password, user.password).then((valid) => {
            //If the password is nor valid, return error
            if (!valid) {
                return res.status(401).json({
                    error: new Error('Incorrect password!')
                });
            }
            //sign() to encode a new token
            //he token's validity time to 24 hours
            //use RANDOM_TOKEN_SECRET to see the token in Chrome DevTools Network
            const token = jwt.sign(
                {userId: user._id}, 
                'DEVEV_RANDOM_SECRET', 
                {expiresIn: '24h'});
            res.status(200).json({
                userId: user._id, 
                token: token
            });
        }).catch((error) => {
            res.status(500).json({
                error: error
            });
        });
    }).catch((error) => {
        res.status(500).json({
            error: error
        });
    });
};
