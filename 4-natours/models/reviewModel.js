const mongoose = require('mongoose');
const Tour = require('./tourModel');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review can not be empty'],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
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
    toJSON: { virtuals: true }, // include virtual properties into the JSON output
    toObject: { virtuals: true },
  }
);

reviewSchema.index({ tour: 1, user: 1 }, { unique: true }); // With this index, each combination of tour and user must be unique

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name photo',
  });

  next();
});

reviewSchema.statics.calcAverageRatings = async function (tourId) {
  // This points to the current model

  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 }, // add 1 for each tour that we match
        avgRating: { $avg: '$rating' },
      },
    },
  ]);

  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
};

// CALCULATE AVERAGE RATING AND NUMBER OF REVIEWS

reviewSchema.post('save', function () {
  // This points to current review, constructor is the model who created the review
  this.constructor.calcAverageRatings(this.tour);
});

// CALCULATE AVERAGE RATING AND NUMBER OF REVIEWS WHEN A REVIEW IS UPDATED OR DELETED

// findByIdAndUpdate
// findByIdAndDelete

reviewSchema.post(/^findOneAnd/, async function (doc) {
  if (doc) {
    await doc.constuctor.calcAverageRatings(doc.tour);
  }
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
