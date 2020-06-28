const express = require('express');
const router = express.Router();
const passport = require('passport');

//accessing home controller
var verifyEmailController = require('../controllers/verify-email-controller');

//routes
router.get('/',verifyEmailController.home);
router.get('/send-verification-mail',verifyEmailController.sendVerificationMail);
router.get('/verify-email/:token',verifyEmailController.verifyEmail);


module.exports = router;