const fs = require('fs');
const express = require('express');
const router = express.Router();
const tourController = require(`${__dirname}/../controllers/tourController`);
const authController = require('./../controllers/authController');
const reviewRouter = require('../routes/reviewRoutes');

//POST /tour/234f/reviews
//GET /tour/234f/reviews
//GET /tour/234f/reviews/4858rtw
// router
//   .route('/:tourId/reviews')
//   .post(
//     authController.protect,
//     authController.restrictTo('user'),
//     reviewController.createReview
//   );

router.use('/:tourId/reviews', reviewRouter);

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
  .get(tourController.getAllTours)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.createTour
  );
// .post(tourController.checkBody, tourController.createTour);

router.route('/tour-stats').get(tourController.getTourStats);

router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(tourController.getToursWithin);

//  /tours-within?distance=233&center=-40,45&unit=mi
//   /tours-within/233/center/40,45/unit/mi

router.route('/distances/:latlng/unit/:unit').get(tourController.getDistances);

router
  .route('/monthly-plan/:year')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.getMonthlyPlan
  );

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.updateTour
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour
  );

module.exports = router;
