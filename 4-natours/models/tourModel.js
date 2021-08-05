const mongoose = require('mongoose');
const slugify = require('slugify');
// const User = require('./userModel');

// Schema
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true, // removes whitespaces at the beginning and end
      maxlength: [40, 'A tour name must have less or equal than 40 characters'],
      minlength: [10, 'A tour name must have more or equal than 10 characters'],
      // validate: [validator.isAlpha, 'Tour name must only contain characters'],
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
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy, medium or difficult!',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
      set: (val) => Math.round(val * 10) / 10,
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
          // this points to the current document only when we create new documents! not when updating!
          return val < this.price;
        },
        message: 'Discount price ({VALUE}) should be below the regular price.',
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a description'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(), // mongoose automatically converts milliseconds to timestamp
      select: false, // mongoose excludes this field when using select
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
    startLocation: {
      // GeoJSON
      type: {
        // required
        type: String,
        default: 'Point',
        enu: ['Point'],
      },
      coordinates: [Number], // required
      address: String,
      description: String,
    },
    locations: [
      {
        // GeoJSON
        type: {
          // required
          type: String,
          default: 'Point',
          enu: ['Point'],
        },
        coordinates: [Number], // required
        address: String,
        description: String,
        day: Number,
      },
    ],
    /* Embedding: the problem is that if for some reason a user changes his e-mail, we would need to update all the tours that embed that user..
     The solution is to use child-referencing.. */
    // guides: Array,

    /* Child referencing */
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    toJSON: { virtuals: true }, // include virtual properties into the JSON output
    toObject: { virtuals: true },
  }
);

// INDEXES

// tourSchema.index({ price: 1 }); // 1: ascending, -1: descending
tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation: '2dsphere' }); // this index is necessary in order to use geospatial queries

// VIRTUAL PROPERTIES

// this value will be created each time we get a tour document from the database
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7; // this -> is the current document
});

// VIRTUAL POPULATION
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id',
});

// DOCUMENT MIDDLEWARE
/* 
  runs before .save() and .create()
  'save' is called -> hook
  We can define multiple middlewares for the same hook.
*/
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next(); // just like express's middlewares
});

/* Embedding: the problem is that if for some reason a user changes his e-mail, we would need to update all the tours that embed that user..
     The solution is to use child-referencing.. */
// tourSchema.pre('save', async function (next) {
//   const guidesPromises = this.guides.map(async (id) => await User.findById(id));
//   this.guides = await Promise.all(guidesPromises);
//   next(); // just like express's middlewares
// });

// tourSchema.pre('save', function (next) {
//   console.log('will save document...');
//   next();
// });

// tourSchema.post('save', function (document, next) {
//   // document is the document that has been just saved in the database
//   console.log(document);
//   next();
// });

// QUERY MIDDLEWARE
/*
  This middleware is differs from the document middleware in the fact that 'this' points to the query!
  For example: we have some VIP tours that must not be displayed to normal subscribers.

  As find and findOne are different, we would need to implement the same handler two times although 
  a normal subscriber could access a VIP tour by requesting it using its ID.
  To avoid duplicating code we can use REGEX (all the strings that start with 'find')
*/
tourSchema.pre(/^find/, function (next) {
  this.find({
    secretTour: { $ne: true },
  });

  this.start = Date.now();
  next();
});

tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt',
  }); // the populate function fills up the fileds that reference a child entity (for example a user inside a tour). This only happens inside the query, we don't touch the database!

  next();
});

tourSchema.post(/^find/, function (documents, next) {
  console.log(`Query took ${Date.now() - this.start} ms!`);
  next();
});

// AGGREGATION MIDDLEWARE
/*
  We can also exclude VIP tours from aggregations!
*/
tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({
    $match: { secretTour: { $ne: true } },
  }); // put at the beginning of the array

  next();
});

// Model
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
