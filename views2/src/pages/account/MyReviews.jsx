import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiEdit2, FiTrash2, FiX, FiCheck } from 'react-icons/fi';
import axios from 'axios';

const MyReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [editingReview, setEditingReview] = useState(null);
  const [editReviewText, setEditReviewText] = useState('');
  const [editRating, setEditRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get('/api/v1/reviews/getMyReviews', {
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

  const renderStars = (rating, editable = false, setRating = () => {}) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`text-3xl cursor-pointer ${
          i < rating ? 'text-yellow-400' : 'text-gray-300'
        }`}
        onClick={() => editable && setRating(i + 1)}
      >
        ★
      </span>
    ));
  };

  const startEditing = (review) => {
    setEditingReview(review._id);
    setEditReviewText(review.review);
    setEditRating(review.rating);
  };

  const cancelEditing = () => {
    setEditingReview(null);
    setEditReviewText('');
    setEditRating(5);
  };

  const handleUpdateReview = async () => {
    if (!editReviewText.trim()) return;

    try {
      setIsSubmitting(true);
      const res = await axios.patch(
        `/api/v1/reviews/${editingReview}`,
        {
          review: editReviewText,
          rating: editRating,
        },
        { withCredentials: true }
      );

      if (res.data.status === 'success') {
        setReviews(
          reviews.map((review) =>
            review._id === editingReview
              ? { ...review, review: editReviewText, rating: editRating }
              : review
          )
        );
        cancelEditing();
      }
    } catch (err) {
      console.error('Error updating review:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await axios.delete(`/api/v1/reviews/${reviewId}`, {
          withCredentials: true,
        });
        setReviews(reviews.filter((review) => review._id !== reviewId));
      } catch (err) {
        console.error('Error deleting review:', err);
      }
    }
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
              className="bg-white shadow-2xl rounded-2xl overflow-hidden transform hover:scale-105 transition-transform duration-300 ease-in-out relative"
              whileHover={{ y: -5 }}
            >
              {/* Edit/Delete Buttons */}
              <div className="absolute top-4 right-4 flex space-x-2">
                <button
                  onClick={() => startEditing(review)}
                  className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition"
                  title="Edit review"
                >
                  <FiEdit2 size={20} />
                </button>
                <button
                  onClick={() => handleDeleteReview(review._id)}
                  className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition"
                  title="Delete review"
                >
                  <FiTrash2 size={20} />
                </button>
              </div>

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
                {editingReview === review._id ? (
                  <div className="mb-4">
                    <div className="flex items-center">
                      {renderStars(editRating, true, setEditRating)}
                      <span className="ml-3 text-gray-600 font-medium text-xl">
                        ({editRating}/5)
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center mb-4">
                    {renderStars(review.rating)}
                    <span className="ml-3 text-gray-600 font-medium text-xl">
                      ({review.rating}/5)
                    </span>
                  </div>
                )}

                {/* Review Text */}
                {editingReview === review._id ? (
                  <textarea
                    value={editReviewText}
                    onChange={(e) => setEditReviewText(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="4"
                  />
                ) : (
                  <p className="text-gray-600 mb-6 font-medium text-lg">
                    {review.review}
                  </p>
                )}

                {/* Review Date */}
                <p className="text-gray-600 text-lg font-medium">
                  Reviewed on: {new Date(review.createdAt).toLocaleDateString()}
                </p>

                {/* Edit Controls */}
                {editingReview === review._id && (
                  <div className="flex justify-end space-x-3 mt-4">
                    <button
                      onClick={cancelEditing}
                      className="px-4 py-2 flex items-center text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
                    >
                      <FiX className="mr-2" /> Cancel
                    </button>
                    <button
                      onClick={handleUpdateReview}
                      disabled={isSubmitting}
                      className="px-4 py-2 flex items-center bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:bg-green-400"
                    >
                      {isSubmitting ? (
                        'Saving...'
                      ) : (
                        <>
                          <FiCheck className="mr-2" /> Save
                        </>
                      )}
                    </button>
                  </div>
                )}
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
