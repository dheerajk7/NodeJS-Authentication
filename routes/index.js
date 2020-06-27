const express = require('express');
const router = express.Router();

//accessing home controller
var homeController = require('../controllers/home_controller');

//routes
router.get('/',homeController.home);
router.use('/users',require('./users'));

module.exports = router;