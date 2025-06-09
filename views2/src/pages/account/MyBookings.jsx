import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiCalendar,
  FiDollarSign,
  FiUser,
  FiCheckCircle,
  FiXCircle,
} from 'react-icons/fi';
import axios from 'axios';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [currentTour, setCurrentTour] = useState(null);
  const [reviewMessage, setReviewMessage] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  useEffect(() => {
    const getBookings = async () => {
      try {
        setLoading(true);
        const res = await axios.get('/api/v1/bookings/getMyBookings', {
          withCredentials: true,
        });
        if (res.data.status === 'success') {
          setBookings(res.data.data.bookings);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch bookings');
      } finally {
        setLoading(false);
      }
    };
    getBookings();
  }, []);

  const openReviewModal = (booking) => {
    setCurrentTour(booking);
    setReviewMessage('');
    setReviewRating(5);
    setShowReviewModal(true);
  };

  const closeReviewModal = () => {
    if (!isSubmittingReview) {
      setShowReviewModal(false);
      setCurrentTour(null);
    }
  };

  const handleSubmitReview = async () => {
    if (!reviewMessage.trim()) return;

    try {
      setIsSubmittingReview(true);
      await axios.post(
        `/api/v1/reviews`,
        {
          tour: currentTour.tour._id,
          review: reviewMessage,
          rating: reviewRating,
        },
        {
          withCredentials: true,
        }
      );
      closeReviewModal();
    } catch (err) {
      console.error('Review submission failed:', err);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto p-6 bg-red-100 rounded-xl shadow-md">
          <h3 className="text-xl font-semibold text-red-700 mb-3">
            Error Occurred
          </h3>
          <p className="text-red-600 mb-4 text-sm">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="p-4 md:p-8 bg-gradient-to-br from-gray-50 to-white min-h-screen font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            My Bookings
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Manage your tour bookings and share your experiences
          </p>
        </div>

        {bookings.length === 0 ? (
          <div className="text-center py-12 md:py-16">
            <div className="w-48 h-48 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <svg
                className="w-24 h-24 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <h3 className="text-xl md:text-2xl font-semibold text-gray-800 mb-2">
              No Bookings Found
            </h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              You haven't booked any tours yet. Start exploring our amazing
              destinations!
            </p>
            <button
              className="px-6 py-3 bg-gradient-to-r from-green-400 to-green-600 text-white rounded-lg hover:from-green-500 hover:to-green-700 transition-all shadow-lg hover:shadow-xl font-medium"
              onClick={() => (window.location.href = '/tours')}
            >
              Browse Available Tours
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.map((booking) => (
              <motion.div
                key={booking._id}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100"
                whileHover={{ y: -5 }}
                layout
              >
                <div className="relative h-56">
                  <img
                    src={`/img/tours/${booking.tour.imageCover}`}
                    alt={booking.tour.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-4">
                    <h3 className="text-xl font-bold text-white leading-tight">
                      {booking.tour.name}
                    </h3>
                  </div>
                  <div className="absolute top-4 right-4 bg-white/90 text-gray-800 text-xs font-bold px-2 py-1 rounded-full">
                    ${booking.price.toLocaleString()}
                  </div>
                </div>

                <div className="p-5">
                  <div className="space-y-3 mb-4 text-gray-600">
                    <div className="flex items-center space-x-2">
                      <FiUser className="text-green-500 flex-shrink-0" />
                      <span className="truncate">{booking.user.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FiCalendar className="text-green-500 flex-shrink-0" />
                      <span>
                        {new Date(booking.createdAt).toLocaleDateString(
                          'en-US',
                          {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          }
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                        booking.paid
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {booking.paid ? (
                        <>
                          <FiCheckCircle className="mr-1.5" /> Paid
                        </>
                      ) : (
                        <>
                          <FiXCircle className="mr-1.5" /> Pending
                        </>
                      )}
                    </span>

                    <motion.button
                      className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all shadow-sm text-sm font-medium"
                      whileTap={{ scale: 0.95 }}
                      onClick={() => openReviewModal(booking)}
                    >
                      Leave Review
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {showReviewModal && currentTour && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeReviewModal}
          >
            <motion.div
              className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl border border-gray-100"
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Write a Review
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {currentTour.tour.name}
                  </p>
                </div>
                <button
                  onClick={closeReviewModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  disabled={isSubmittingReview}
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Rating
                </label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setReviewRating(star)}
                      className={`text-3xl transition-colors ${
                        star <= reviewRating
                          ? 'text-yellow-400'
                          : 'text-gray-300'
                      }`}
                      disabled={isSubmittingReview}
                    >
                      {star <= reviewRating ? '★' : '☆'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Experience
                </label>
                <textarea
                  value={reviewMessage}
                  onChange={(e) => setReviewMessage(e.target.value)}
                  placeholder="What did you like about this tour? How was your guide?"
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                  rows="5"
                  disabled={isSubmittingReview}
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={closeReviewModal}
                  className="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
                  disabled={isSubmittingReview}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitReview}
                  className="px-5 py-2 rounded-lg bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 transition-all shadow-md flex items-center justify-center min-w-[120px]"
                  disabled={isSubmittingReview || !reviewMessage.trim()}
                >
                  {isSubmittingReview ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    'Submit Review'
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
};

export default MyBookings;
