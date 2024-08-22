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

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.getAllTours = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    //Tour.findOne({_id:req.params.id})
    res.status(200).json({
      status: 'success',
      data: {
        tour: tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    //const newTour = new Tour({})
    //newTour.save()

    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};
// /api/v1/tours/:id/:x/:y?  this is for optional

exports.updateTour = async (req, res) => {
  // we can use this method if we wan't to update some object field not entire object
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  try {
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.removeField = async (req, res) => {
  console.log('Received request to remove field');
  try {
    console.log('Starting field removal process');
    const result = await Tour.updateMany(
      { ratingAverage: { $exists: true } },
      { $unset: { ratingAverage: '' } }
    );

    console.log('Field removal result:', result);

    res.status(200).json({
      status: 'success',
      message: 'Field removed successfully',
      data: result,
    });
  } catch (err) {
    console.error('Error during field removal:', err);
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getTourStats = async (req, res) => {
  try {
    const matchedTours = await Tour.find();
    console.log(matchedTours);

    const stats = await Tour.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } },
      },
      {
        $group: {
          _id: null,
          numTours: { $sum: 1 },
          numRatings: { $sum: '$ratingsAverage' },
          avgRating: { $avg: '$ratingsAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
        },
      },
    ]);
    console.log(stats);
    res.status(200).json({
      status: 'success',
      data: {
        stats,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};
