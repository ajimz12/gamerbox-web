import React from "react";
import ReviewItem from "./ReviewItem";

const ReviewList = ({ reviews }) => {
  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <ReviewItem key={review.id} review={review} />
      ))}
    </div>
  );
};

export default ReviewList;
