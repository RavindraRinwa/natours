import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../../api/js/api';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const getBookings = async () => {
      try {
        const res = await api.get('/api/v1/bookings/getMyBookings', {
          withCredentials: true,
        });
        console.log(res.data.data.bookings);
        if (res.data.status === 'success') {
          setBookings(res.data.data.bookings);
        }
      } catch (err) {
        console.log(err);
      }
    };
    getBookings();
  }, []);

  return (
    <main className="p-6 bg-gray-50 min-h-screen font-sans">
      <h2 className="text-4xl font-bold text-center mb-8 text-blue-700 tracking-tight">
        My Bookings
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {bookings.length > 0 ? (
          bookings.map((booking) => (
            <motion.div
              key={booking._id}
              className="bg-white shadow-2xl rounded-2xl overflow-hidden transform hover:scale-105 transition-transform duration-300 ease-in-out"
              whileHover={{ y: -5 }}
            >
              {/* Tour Image */}
              <img
                src={`/img/tours/${booking.tour.imageCover}`}
                alt={booking.tour.name}
                className="w-full h-56 object-cover"
              />

              <div className="p-6">
                {/* Tour Name */}
                <h3 className="text-2xl font-bold text-gray-800 mb-3 leading-tight">
                  {booking.tour.name}
                </h3>

                {/* User Name */}
                <p className="text-gray-600 mb-2 font-medium">
                  <span className="font-semibold text-gray-700">
                    Booked By:
                  </span>{' '}
                  {booking.user.name}
                </p>

                {/* Tour Date */}
                <p className="text-gray-600 mb-2 font-medium">
                  <span className="font-semibold text-gray-700">
                    Tour Date:
                  </span>{' '}
                  {new Date(booking.createdAt).toLocaleDateString()}
                </p>

                {/* Price */}
                <p className="text-gray-600 mb-4 font-medium">
                  <span className="font-semibold text-gray-700">Price:</span> $
                  {booking.price}
                </p>

                {/* Payment Status */}
                <p
                  className={`text-sm font-bold mt-2 ${
                    booking.paid ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {booking.paid ? 'Paid ✅' : 'Not Paid ❌'}
                </p>

                {/* Action Buttons */}
                <div className="flex justify-between mt-6">
                  <motion.button
                    className="px-6 py-2 text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-300 font-semibold tracking-wide"
                    whileTap={{ scale: 0.95 }}
                  >
                    View Details
                  </motion.button>

                  <motion.button
                    className="px-6 py-2 text-white bg-red-600 rounded-lg shadow-md hover:bg-red-700 transition-colors duration-300 font-semibold tracking-wide"
                    whileTap={{ scale: 0.95 }}
                  >
                    Cancel Booking
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <p className="text-center text-gray-600 col-span-full text-lg font-medium">
            No bookings found.
          </p>
        )}
      </div>
    </main>
  );
};

export default MyBookings;
