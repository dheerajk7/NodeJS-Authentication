const express = require('express');
const router = express.Router();

//accessing home controller
var homeController = require('../controllers/home_controller');

//routes
router.get('/',homeController.home);
router.use('/users',require('./users'));
router.use('/authenticate',require('./authenticate'));
router.use('/forget-password',require('./forget-password'));
router.use('/verification-email',require('./verification-email'));

module.exports = router;