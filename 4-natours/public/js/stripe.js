/* eslint-disable */

import axios from 'axios';
import { showAlert } from './alerts';

export const bookTour = async (tourId) => {
  const stripe = Stripe(
    'pk_test_51JkQPJAGb2eImRr5jnUHboVB8g0KDfn54732w2RoWzb97xjdryKpkBonD9LzGMZdJ7jIQ6diJJfmEOza34v15AEF00zrmmsEQV'
  );

  try {
    // 1) Get checkout session from the API

    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);

    // 2) Use the Stripe object to create the checkout form + charge the credit card

    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
