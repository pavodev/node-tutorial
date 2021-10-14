const express = require('express');
const bookingController = require('../controllers/bookingController');
const authController = require('../controllers/authController');

/*
 * mergeParams: by default each router has access to the params of its specific routes.
 * As we are using nested routes, we must tell express to merge parameter from the previous router.
 */
const router = express.Router();

router.use(authController.protect);

router.get('/checkout-session/:tourId', bookingController.getCheckoutSession);

router.use(authController.restrictTo('admin', 'lead-guide'));

router
  .route('/')
  .get(bookingController.getAllBookings)
  .post(bookingController.createBooking);

router
  .route('/:id')
  .get(bookingController.getBooking)
  .patch(bookingController.updateBooking)
  .delete(bookingController.deleteBooking);

module.exports = router;
