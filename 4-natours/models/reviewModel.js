const mongoose = require('mongoose');

const reviewSchema = new mongoose.Scherma({
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
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
