const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

/*
 * mergeParams: by default each router has access to the params of its specific routes.
 * As we are using nested routes, we must tell express to merge parameter from the previous router.
 */
const router = express.Router({ mergeParams: true });

// POST /reviews
// GET /tour/234/reviews
// POST /tour/234/reviews

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.protect,
    authController.restrictTo('user'),
    reviewController.createReview
  );

module.exports = router;
