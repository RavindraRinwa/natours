const express = require('express');
const router = express.Router();

const viewsController = require('../controllers/viewController');

//ROUTES
router.get('/', viewsController.getOverivew);
router.get('/tour', viewsController.getTour);

module.exports = router;
