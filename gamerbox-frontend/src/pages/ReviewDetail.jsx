import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getReviewById } from "../services/api/reviews";
import ReviewItem from "../components/ReviewItem";
import LoadingSpinner from "../components/LoadingSpinner";
import { FaArrowLeft } from "react-icons/fa";
import CommentSection from "../components/CommentSection";

const ReviewDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [review, setReview] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReviewDetails = async () => {
      try {
        setIsLoading(true);
        setError("");
        const reviewData = await getReviewById(id);
        setReview(reviewData);
      } catch (error) {
        setError("Error al cargar los detalles de la reseña. Por favor, inténtalo de nuevo más tarde.");
        console.error("Error al cargar los detalles de la reseña:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchReviewDetails();
    }
  }, [id]);

  const handleReviewUpdated = (updatedReview) => {
    setReview(updatedReview);
  };

  const handleReviewDeleted = () => {
    // Redirigir a la página del juego después de eliminar
    if (review && review.gameId) {
      window.location.href = `/games/${review.gameId}`;
    } else {
      window.location.href = "/";
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#121212]">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!review) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#121212]">
        <div className="text-[#E0E0E0]">Reseña no encontrada</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-chakra bg-[#121212] py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-[#3D5AFE] hover:text-[#536DFE] transition-colors"
          >
            <FaArrowLeft className="mr-2" />
            Volver
          </button>
        </div>

        <h1 className="text-3xl font-bold text-[#E0E0E0] mb-6">
          Reseña de {review.gameName}
        </h1>

        <div className="mb-8">
          <ReviewItem
            review={review}
            onReviewUpdated={handleReviewUpdated}
            onReviewDeleted={handleReviewDeleted}
          />
        </div>

        {/* Sección de comentarios */}
        <div className="bg-[#252525] p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-[#E0E0E0] mb-4">
            Comentarios
          </h2>
          <CommentSection reviewId={review.id} />
        </div>
      </div>
    </div>
  );
};

export default ReviewDetail;