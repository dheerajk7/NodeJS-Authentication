const express = require('express');
const router = express.Router();
const passport = require('passport');

//accessing home controller
var authenticateController = require('../controllers/authenticate-controller');
//routes
router.get('/sign-in',authenticateController.signIn);
router.get('/sign-up',authenticateController.signUp);
//crearting session for user login
router.post('/create-session',passport.authenticate(
    'local',
    {
        failureRedirect:'/authenticate/sign-in',
    }
),authenticateController.createSession);  
router.get('/sign-out',passport.checkAuthentication,authenticateController.signOut);

//google authentication
router.get('/auth/google',passport.authenticate('google',{scope:['profile','email']}));
router.get('/auth/google/callback',passport.authenticate('google',{failureRedirect:'/authenticate/sign-in'}),authenticateController.createSession);


module.exports = router;