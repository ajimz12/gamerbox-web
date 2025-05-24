import React, { useState, useEffect } from "react";
import { getAllReviews } from "../services/api/reviews";
import ReviewList from "../components/ReviewList";
import LoadingSpinner from "../components/LoadingSpinner";

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [orderBy, setOrderBy] = useState("date");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setIsLoading(true);
        setError(""); 
        const data = await getAllReviews(orderBy);
        if (Array.isArray(data)) {
          setReviews(data);
        } else {
          setError("Formato de datos inválido");
        }
      } catch (error) {
        console.error("Error al cargar las reseñas:", error);
        setError("Error al cargar las reseñas. Por favor, intenta de nuevo más tarde.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, [orderBy]);

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-[#121212] py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-[#E0E0E0]">Reseñas</h1>
          <div className="flex items-center font-chakra gap-4">
            <label className="text-[#E0E0E0] text-sm">Ordenar por:</label>
            <select
              value={orderBy}
              onChange={(e) => setOrderBy(e.target.value)}
              className="bg-[#252525] text-[#E0E0E0] px-4 py-2 rounded-lg border border-[#404040]"
            >
              <option value="date">Más recientes</option>
              <option value="popular">Más populares</option>
            </select>
          </div>
        </div>

        {error ? (
          <div className="text-red-500 text-center">{error}</div>
        ) : (
          <ReviewList reviews={reviews} setReviews={setReviews} />
        )}
      </div>
    </div>
  );
};

export default Reviews;