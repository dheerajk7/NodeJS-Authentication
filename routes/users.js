const express = require('express');
const router = express.Router();
const passport = require('passport');

//accessing home controller
var userController = require('../controllers/users_controller');

//routes
router.get('/sign-in',userController.signIn);
router.get('/sign-up',userController.signUp);
router.post('/add-user',userController.addUser);
router.post('/create-session',passport.authenticate(
    'local',
    {
        failureRedirect:'/users/sign-in',
    }
),userController.createSession);  
router.get('/sign-out',passport.checkAuthentication,userController.signOut);
router.get('/profile',passport.checkAuthentication,userController.profile);
router.get('/change-password',passport.checkAuthentication,userController.changePassword);
router.post('/update-password',passport.checkAuthentication,userController.updatePassword);

//google auth

router.get('/auth/google',passport.authenticate('google',{scope:['profile','email']}));
router.get('/auth/google/callback',passport.authenticate('google',{failureRedirect:'/users/signin'}),userController.createSession);

module.exports = router;