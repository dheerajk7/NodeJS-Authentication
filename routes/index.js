const express = require('express');
const router = express.Router();

//accessing home controller
var homeController = require('../controllers/home_controller');

//routes
router.get('/',homeController.home);
router.use('/users',require('./users'));
router.use('/authenticate',require('./authenticate'));

module.exports = router;