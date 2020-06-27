const express = require('express');
const router = express.Router();
const passport = require('passport');

//accessing home controller
var userController = require('../controllers/users_controller');

//routes
router.post('/add-user',userController.addUser);
router.get('/profile',passport.checkAuthentication,userController.profile);
router.get('/change-password',passport.checkAuthentication,userController.changePassword);
router.post('/update-password',passport.checkAuthentication,userController.updatePassword);


module.exports = router;