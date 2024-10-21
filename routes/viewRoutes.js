const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const viewsController = require('../controllers/viewController');

//ROUTES
router.get('/', viewsController.getOverivew);
router.get('/tour/:slug', authController.protect, viewsController.getTour);

router.get('/login', viewsController.getLoginForm);

module.exports = router;
