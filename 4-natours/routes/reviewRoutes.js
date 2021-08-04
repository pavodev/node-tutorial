const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

/*
 * mergeParams: by default each router has access to the params of its specific routes.
 * As we are using nested routes, we must tell express to merge parameter from the previous router.
 */
const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.restrictTo('user'),
    reviewController.setTourUserIds,
    reviewController.createReview
  );

router
  .route('/:id')
  .get(reviewController.getReview)
  .patch(
    authController.restrictTo('user', 'admin'),
    reviewController.updateReview
  )
  .delete(
    authController.restrictTo('user', 'admin'),
    reviewController.deleteReview
  );

module.exports = router;
