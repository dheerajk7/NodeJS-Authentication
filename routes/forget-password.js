const express = require('express');
const router = express.Router();

//accessing home controller
var forgetPasswordController = require('../controllers/forget-password-controller');

//routes
router.get('/',forgetPasswordController.home);
//for sending mail
router.post('/reset-mail',forgetPasswordController.resetMail);
router.get('/set-password/:token',forgetPasswordController.setPassword);
//for saving new password
router.post('/save-password/:token',forgetPasswordController.savePassword);

module.exports = router;