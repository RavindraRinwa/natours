const fs = require('fs');
const express = require('express');
const router = express.Router();
const tourController = require(`${__dirname}/../controllers/tourController`);

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
  .post(tourController.createTour);
// .post(tourController.checkBody, tourController.createTour);

router.route('/tour-stats').get(tourController.getTourStats);

router.route('/remove-field').patch(tourController.removeField);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
