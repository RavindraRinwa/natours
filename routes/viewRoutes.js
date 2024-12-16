const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const viewsController = require('../controllers/viewController');

//ROUTES

router.use(authController.isLoggedIn);

router.get('/', authController.isLoggedIn, viewsController.getOverivew);
router.get('/tour/:slug', authController.isLoggedIn, viewsController.getTour);

router.get('/login', authController.isLoggedIn, viewsController.getLoginForm);
router.get('/me', authController.protect, viewsController.getAccount);

module.exports = router;
