//-----Sauces routes-----

// Import the necessary modules
const express = require('express');
const router = express.Router();

// Import auth middleware
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

// Custom middleware for validating sauce properties
const { saucePropertyInputs, validate } = require('../middleware/validator');

const saucesCtrl = require('../controllers/sauces');

// Routers with auth 
router.get('/', auth, saucesCtrl.getAllSauces); // GET request for all sauces
router.get('/:id', auth, saucesCtrl.getOneSauce); // GET request for a specific sauce
router.delete('/:id', auth, saucesCtrl.deleteSauce); // DELETE request for a specific sauce
router.post('/', saucePropertyInputs(), validate, auth, multer, saucesCtrl.createSauce); // POST request to create a new sauce
router.put('/:id', saucePropertyInputs(), validate, auth, multer, saucesCtrl.modifySauce); // PUT request to modify an existing sauce
router.post('/:id/like', auth, saucesCtrl.likeSauce); // POST request to like a specific sauce

// Export the router for use in other modules
module.exports = router;

//-----End------