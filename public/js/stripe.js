import axios from 'axios';
import { showAlert } from './alerts';
const stripe = Stripe(
  'pk_test_51Qj1fK2fScM1vyABxp7VyWyMiE7m1VZZhABKB9Q5YeZAQjiBOrydvVfdIDFyi6cG3FZy5oUfZNX4okEodFv5fODy00f0ktBRxR'
);

export const bookTour = async (tourId) => {
  try {
    //1) Get checkout session from API
    const session = await axios(
      `http://127.0.0.1:4000/api/v1/bookings/checkout-session/${tourId}`
    );
    //2)Create checout form + chanre credit card
    // await stripe.redirectToCheckout({
    //   sessionId: session.data.session.id,
    // });
    window.location.href = session.data.session.url;
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
