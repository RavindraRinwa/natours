const mongoose = require('mongoose');
const Tour = require('./tourModel');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review can not be empty!'],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reviewSchema.index(
  {
    tour: 1,
    user: 1,
  },
  {
    unique: true,
  }
);

reviewSchema.pre(/^find/, function (next) {
  //   this.populate({
  //     path: 'tour',
  //     select: 'name',
  //   }).populate({
  //     path: 'user',
  //     select: 'name photo',
  //   });
  this.populate({
    path: 'user',
    select: 'name photo',
  });
  next();
});

//here this point to Model
reviewSchema.statics.calcAverageRatings = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);

  if (stats[0].length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingQuantity: stats[0].nRating,
      ratingAverage: stats[0].avgRating,
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingQuantity: 0,
      ratingAverage: 4.5,
    });
  }
};

// this.constructer point to current MODEL
reviewSchema.post('save', function () {
  //this points to current review
  this.constructor.calcAverageRatings(this.tour);
});

//findByIdAndUpdate
//findByIdAndDelete

reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.model.findOne(this.getQuery()); // to access the review model in query middle ware
  // console.log(this.r);
  //save in current query so that i can access in post
  next();
});

reviewSchema.post(/^findOneAnd/, async function () {
  // this.r = await this.findOne(); does NOT work here,query has already executed
  await this.r.constructor.calcAverageRatings(this.r.tour);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
