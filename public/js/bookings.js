import axios from 'axios';
import { showAlert } from './alerts';

export const getBookings = async () => {
  try {
    const res = await axios.get('/api/v1/bookings/my-bookings', {
      withCredentials: true,
    });

    if (res.data.status === 'success') {
      return res.data.data.bookings;
    }
  } catch (err) {
    showAlert('error', 'Error fetching bookings. Try again!');
  }
};
