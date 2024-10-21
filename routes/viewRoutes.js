const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const viewsController = require('../controllers/viewController');

//ROUTES

router.use(authController.isLoggedIn);

router.get('/', viewsController.getOverivew);
router.get('/tour/:slug', viewsController.getTour);

router.get('/login', viewsController.getLoginForm);

module.exports = router;
