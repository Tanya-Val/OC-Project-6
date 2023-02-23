//-----Router register file-----

// Import the necessary modules
const express = require('express');
const router = express.Router();

// Import the user controller
const userCtrl = require('../controllers/user');

// POST request to create a new user account
router.post('/signup', userCtrl.signup);
// POST request to log in to an existing user account
router.post('/login', userCtrl.login);

// Export the router for use in other modules
module.exports = router;

//-----End------