import React from "react";
import ReviewItem from "./ReviewItem";
import { useAuth } from "../context/AuthContext";

const ReviewList = ({ reviews, setReviews }) => {
  const { user } = useAuth();

  const handleReviewUpdated = (updatedReview) => {
    setReviews(reviews.map(review => 
      review.id === updatedReview.id ? updatedReview : review
    ));
  };

  const handleReviewDeleted = (reviewId) => {
    setReviews(reviews.filter(review => review.id !== reviewId));
  };

  // Mantener el orden original de las reseñas ya que el backend ya las ordena correctamente
  const sortedReviews = [...reviews];

  return (
    <div className="space-y-6">
      {sortedReviews.map((review) => (
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
