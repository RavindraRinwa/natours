import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../../api/js/api';

const MyReviews = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await api.get('/api/v1/reviews/getMyReviews', {
          withCredentials: true,
        });
        if (res.data.status === 'success') {
          setReviews(res.data.data.reviews);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchReviews();
  }, []);

  // Function to render star rating
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={`text-3xl ${
            i <= rating ? 'text-yellow-400' : 'text-gray-300'
          }`}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <main className="p-6 bg-gray-50 min-h-screen font-sans">
      <h2 className="text-5xl font-bold text-center mb-8 text-blue-700 tracking-tight">
        My Reviews
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <motion.div
              key={review._id}
              className="bg-white shadow-2xl rounded-2xl overflow-hidden transform hover:scale-105 transition-transform duration-300 ease-in-out"
              whileHover={{ y: -5 }}
            >
              {/* Tour Image */}
              <img
                src={`/img/tours/${review.tour.imageCover}`}
                alt={review.tour.name}
                className="w-full h-56 object-cover"
              />

              <div className="p-6">
                {/* Tour Name */}
                <h3 className="text-3xl font-bold text-gray-800 mb-4 leading-tight">
                  {review.tour.name}
                </h3>

                {/* Rating */}
                <div className="flex items-center mb-4">
                  {renderStars(review.rating)}
                  <span className="ml-3 text-gray-600 font-medium text-xl">
                    ({review.rating}/5)
                  </span>
                </div>

                {/* Review Text */}
                <p className="text-gray-600 mb-6 font-medium text-lg">
                  {review.review}
                </p>

                {/* Review Date */}
                <p className="text-gray-600 text-lg font-medium">
                  Reviewed on: {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </div>
            </motion.div>
          ))
        ) : (
          <p className="text-center text-gray-600 col-span-full text-2xl font-medium">
            No reviews found.
          </p>
        )}
      </div>
    </main>
  );
};

export default MyReviews;
