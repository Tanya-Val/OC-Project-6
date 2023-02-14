const express = require('express');
const router = express.Router();

//Import auth middleware
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const { saucePropertyInputs, validate } = require('../middleware/validator');

const saucesCtrl = require('../controllers/sauces');

//Routers with auth 
router.get('/', auth, saucesCtrl.getAllSauces);
router.get('/:id', auth, saucesCtrl.getOneSauce);
router.delete('/:id', auth, saucesCtrl.deleteSauce);
router.post('/', saucePropertyInputs(), validate, auth, multer, saucesCtrl.createSauce);
router.put('/:id', saucePropertyInputs(), validate, auth, multer, saucesCtrl.modifySauce);
router.post('/:id/like', auth, saucesCtrl.likeSauce);

module.exports = router;