const fs = require('fs');
const express = require('express');
const router = express.Router();
const tourController = require(`${__dirname}/../controllers/tourController`);
const authController = require('./../controllers/authController');

//you can do also like this

// const {
//   getAllTours,
//   createTour,
// } = require(`${__dirname}/../controllers/tourController`);

// router.param('id', (req, res, next, val) => {
//   console.log(`Tour id is:${val}`);
//   next();
// });

// router.param('id', tourController.checkID);
router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);
router
  .route('/')
  .get(authController.protect, tourController.getAllTours)
  .post(tourController.createTour);
// .post(tourController.checkBody, tourController.createTour);

router.route('/tour-stats').get(tourController.getTourStats);

router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour
  );

module.exports = router;
