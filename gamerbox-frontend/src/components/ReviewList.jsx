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

  // Ordenar las reseñas para que la del usuario actual aparezca primero
  const sortedReviews = [...reviews].sort((a, b) => {
    if (user && a.author.id === user.id) return -1;
    if (user && b.author.id === user.id) return 1;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

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
