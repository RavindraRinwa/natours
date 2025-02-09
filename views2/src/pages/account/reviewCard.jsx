import React from 'react';

const ReviewCard = ({ review }) => {
  return (
    <div className="reviews__card">
      <div className="reviews__avatar">
        <img
          className="reviews__avatar-img"
          src={`/img/users/${review.user.photo}`}
          alt={review.user.name}
        />
      </div>
      <h6 className="reviews__user">{review.user.name}</h6>
      <p className="reviews__text">{review.review}</p>
      <div className="reviews__rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`reviews__star ${
              review.rating >= star
                ? 'reviews__star--active'
                : 'reviews__star--inactive'
            }`}
          >
            <use xlinkHref="/img/icons.svg#icon-star" />
          </svg>
        ))}
      </div>
    </div>
  );
};

export default ReviewCard;
