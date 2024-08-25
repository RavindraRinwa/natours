// const fs = require('fs');
// // const tours = JSON.parse(
// //   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// // );

// const Tour = require(`./../models/tourModel`);

// // exports.checkID = (req, res, next, val) => {
// //   // if (req.params.id * 1 > tours.length) {
// //   //   return res.status(404).json({
// //   //     status: 'fail',
// //   //     message: 'Invalid ID',
// //   //   });
// //   // }
// //   next();
// // };

// exports.checkBody = (req, res, next, val) => {
//   console.log(req.body);
//   if (!req.body.name || !req.body.price) {
//     return res.status(400).json({
//       status: 'fail',
//       message: 'Missing name or price',
//     });
//   }
//   s;
//   next();
// };

// exports.getAllTours = (req, res) => {
//   console.log(req.requestTime);
//   // res.status(200).json({
//   //   status: 'success',
//   //   requestedAt: req.requestTime,
//   //   results: tours.length,
//   //   data: {
//   //     tours,
//   //   },
//   // });
// };

// exports.getTour = (req, res) => {
//   const id = +req.params.id;
//   // const tour = tours.find((el) => el.id === id);
//   // res.status(200).json({
//   //   status: 'success',
//   //   data: {
//   //     tour,
//   //   },
//   // });
// };

// exports.createTour = (req, res) => {
//   console.log(req.body);
//   // const newId = tours[tours.length - 1].id + 1;
//   // const newTour = Object.assign({ id: newId }, req.body);
//   // tours.push(newTour);
//   // fs.writeFile(
//   //   `${__dirname}/../dev-data/data/tours-simple.json`,
//   //   JSON.stringify(tours),
//   //   (err) => {
//   //     res.status(201).json({
//   //       status: 'success',
//   //       data: {
//   //         tour: newTour,
//   //       },
//   //     });
//   //   }
//   // );
// };
// // /api/v1/tours/:id/:x/:y?  this is for optional
// exports.updateTour = (req, res) => {
//   res.status(200).json({
//     status: 'success',
//     data: {
//       tour: '<Updated tour here....>',
//     },
//   });
// };

// exports.deleteTour = (req, res) => {
//   res.status(204).json({
//     status: 'success',
//     data: null,
//   });
// };

const fs = require('fs');
const Tour = require(`./../models/tourModel`);

const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('../utils/appError');

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.getAllTours = catchAsync(async (req, res, next) => {
  //create a copy of req.query
  //BUILD QUERY
  //1A)Filtering
  // const queryObj = { ...req.query };
  // const excludedFields = ['page', 'sort', 'limit', 'fields'];
  // excludedFields.forEach((el) => delete queryObj[el]);

  // //1B)Advanced filtering
  // let queryStr = JSON.stringify(queryObj);

  // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

  // // console.log();
  // // console.log(req.query, queryObj);

  // let query = Tour.find(JSON.parse(queryStr));
  // //{difficulty:'easy',duration:{$gte:5}}

  //2)Sorting

  //127.0.0.1:4000/api/v1/tours?sort=-price for sorting in desending order
  // if (req.query.sort) {
  //   const sortBy = req.query.sort.split(',').join(' ');
  //   query = query.sort(sortBy);
  //   //sort('price ratingAverage')
  // } else {
  //   query = query.sort('-createdAt');
  // }

  //{ duration: { gte: '5' }, difficulty: 'easy' }
  // const tours = await Tour.find({
  //   duration: 5,
  //   difficulty: 'easy',
  // });

  // const tours = await Tour.find()
  //   .where('duration')
  //   .equals(5)
  //   .where('difficulty')
  //   .equals('easy');

  // //3)Field limiting
  // if (req.query.fields) {
  //   const fields = req.query.fields.split(',').join(' ');
  //   query = query.select(fields);
  // } else {
  //   query = query.select('-__v');
  // }

  //4)Pagination
  // const page = req.query.page * 1 || 1;
  // const limit = req.query.limit * 1 || 100;
  // const skip = (page - 1) * limit;
  // //page=2&limit=10,1-10,page 1,11-20,pag2 2
  // query = query.skip(skip).limit(limit);

  // if (req.query.page) {
  //   const numTours = await Tour.countDocuments();
  //   if (skip >= numTours) throw new Error('This page does not exist');
  // }

  //EXECUTE QUERY
  // const tours = await query;

  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const tours = await features.query;

  //SEND RESPONSE
  res.status(200).json({
    status: 'success',
    result: tours.length,
    data: {
      tour: tours,
    },
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);

  if (!tour) {
    return next(new AppError('No tour found with that ID', 404));
  }
  //Tour.findOne({_id:req.params.id})
  res.status(200).json({
    status: 'success',
    data: {
      tour: tour,
    },
  });
});

//There is two big problem it would not work at all
/*
1.fn don't have any way to know the parameter req,res and next
2.we are actually calling async function
we are calling catchAsync function using parathesis and inside catchAsync we also calling fn function 

//create tour is function not the result of calling function but it's happen here

the async wait for express calling and express call when any one hit the routes t

SOLUTION:
catchAsync should return a function which return to createTour and that function is called when it necessary


 */

exports.createTour = catchAsync(async (req, res, next) => {
  //const newTour = new Tour({})
  //newTour.save()
  const newTour = await Tour.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      tour: newTour,
    },
  });

  // try {

  // } catch (err) {
  //   res.status(400).json({
  //     status: 'fail',
  //     message: err,
  //   });
  // }
});

// /api/v1/tours/:id/:x/:y?  this is for optional

exports.updateTour = catchAsync(async (req, res, next) => {
  // we can use this method if we wan't to update some object field not entire object
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!tour) {
    return next(new AppError('No tour found with that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

exports.deleteTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndDelete(req.params.id);

  if (!tour) {
    return next(new AppError('No tour found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        // _id: null,
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingAverage' },
        avgRating: { $avg: '$ratingAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
    // {
    //   $match: { _id: { $ne: 'EASY' } },
    // },
  ]);
  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;

  const plan = await Tour.aggregate([
    { $unwind: '$startDates' },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: { month: '$_id' },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: { numTourStarts: -1 },
    },
    // {
    //   $limit: 6,
    // },
  ]);

  res.status(200).json({
    status: 'success',
    result: plan.length,
    data: {
      plan,
    },
  });
});
