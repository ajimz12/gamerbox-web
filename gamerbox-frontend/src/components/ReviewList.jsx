import React from "react";
import ReviewItem from "./ReviewItem";
import { useAuth } from "../context/AuthContext";

const ReviewList = ({ reviews, setReviews, limitToThree = false }) => {
  const { user } = useAuth();

  const handleReviewUpdated = (updatedReview) => {
    setReviews(reviews.map(review => 
      review.id === updatedReview.id ? updatedReview : review
    ));
  };

  const handleReviewDeleted = (reviewId) => {
    setReviews(reviews.filter(review => review.id !== reviewId));
  };

  const displayedReviews = limitToThree ? [...reviews].slice(-3) : reviews;

  return (
    <div className="space-y-6">
      {displayedReviews.map((review) => (
        <ReviewItem 
          key={review.id} 
          review={review} 
          onReviewUpdated={handleReviewUpdated}
          onReviewDeleted={handleReviewDeleted}
        />
      ))}
    </div>
  );
};

export default ReviewList;
