const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');
// const User = require('./userModel');
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'A tour name must have less or equal then 40 characters'],
      minlength: [10, 'A tour name must have more or equal then 10 characters'],
      // validate: [validator.isAlpha, 'Tour name must only contains character'],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, `A tour must have a difficulty`],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either:easy medium,difficult',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be less or equal to 5.0'],
      set: (val) => Math.round(val * 10) / 10, //4.666 -> 5 46.66->47 then divide by 10
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          //this only points to current doc on NEW document creation
          return val < this.price;
        },
        message: 'Discount price ({VALUE}) should be below than regular price',
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a summary'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
      images: [String],
    },
    images: Array,
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
    startLocation: {
      //GeoJSON
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
//arrow function does not have own this keyword(this keyword pointing to current document)

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

tourSchema.index({ price: 1, ratingAverage: -1 });
tourSchema.index({ slug: 1 });

tourSchema.index({ startLocation: '2dsphere' });

//Virtual populate
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id',
});

// tourSchema.pre('save', async function (next) {
//   const guidesPromises = this.guides.map(async (id) => await User.findById(id));
//   this.guides = await Promise.all(guidesPromises);
//   next();
// });
//four type of middle ware
//1)query
//2)document
//3)aggrogate
//4)model middle ware
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// tourSchema.pre('save', function (next) {
//   console.log('Will save document...');
//   next();
// });

// tourSchema.post('save', function (doc, next) {
//   console.log(doc);
//   next();
// });
//QUERY MIDDLEWARE
//here this keyword point to current query object not to current document

//  /^find/ all string start with find
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });

  //add new property as regular object
  this.start = Date.now();
  next();
});

tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt',
  });
  next();
});

tourSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} miliseconds!`);
  // console.log(docs);
  next();
});

//AGGREGATION MIDDLEWARE
//here this keyword point to the current aggregation object
tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  // console.log(this.pipeline());
  // this.find({ secretTour: { $ne: true } });
  tourSchema.post(/^find/, function (docs, next) {
    console.log(`Query took ${Date.now() - this.start} miliseconds!`);
    console.log(docs);
    next();
  });
});

const Tour = mongoose.model('Tour', tourSchema);

//DOCUMENT MIDDLEWARE:runs before .save() and .create() but not on .insertMany

module.exports = Tour;

//four type of middle ware
//1)query
//2)document
//3)aggrogate
//4)model middle ware
