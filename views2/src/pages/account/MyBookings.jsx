import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MyBookings = () => {
  return (
    <main className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold text-center mb-6">My Bookings</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bookings.length > 0 ? (
          bookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-white p-4 shadow-lg rounded-lg"
            >
              <h3 className="text-xl font-semibold mb-2">
                {booking.tour.name}
              </h3>
              <p className="text-gray-600">User: {booking.user.name}</p>
              <p className="text-gray-600">
                Tour Date: {new Date(booking.createdAt).toLocaleDateString()}
              </p>
              <p className="text-gray-600">Price: ${booking.price}</p>
              <p
                className={`text-sm font-bold mt-2 ${
                  booking.paid ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {booking.paid ? 'Paid' : 'Not Paid'}
              </p>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600 col-span-full">
            No bookings found.
          </p>
        )}
      </div>
    </main>
  );
};

export default MyBookings;
