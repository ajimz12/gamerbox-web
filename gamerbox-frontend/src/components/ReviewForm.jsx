import React, { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { createReview } from "../services/api/reviews";

const ReviewForm = ({ gameId, onReviewSubmitted, reviews }) => {
  const { user } = useAuth();
  const [userHasReview, setUserHasReview] = useState(false);
  const [playedBefore, setPlayedBefore] = useState(false);
  const [playedAt, setPlayedAt] = useState(
    new Date().toISOString().split("T")[0]
  );

  const formatDate = (dateString) => {
    const months = [
      "Ene",
      "Feb",
      "Mar",
      "Abr",
      "May",
      "Jun",
      "Jul",
      "Ago",
      "Sep",
      "Oct",
      "Nov",
      "Dic",
    ];
    const date = new Date(dateString);
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  useEffect(() => {
    if (user && reviews) {
      const hasReview = reviews.some((review) => review.author.id === user.id);
      setUserHasReview(hasReview);
    }
  }, [user, reviews]);

  if (userHasReview) {
    return null;
  }
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [hover, setHover] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Por favor, selecciona una calificación");
      return;
    }

    setIsSubmitting(true);
    try {
      const data = await createReview(gameId, rating, text, playedBefore, playedAt);
      toast.success("¡Reseña publicada con éxito!");
      setText("");
      setRating(0);
      onReviewSubmitted(data);
    } catch (error) {
      toast.error("Error al publicar la reseña");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-[#252525] p-4 sm:p-6 rounded-lg mb-6 max-w-2xl mx-auto">
      <div className="mb-6 flex flex-col gap-4">
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="playedBefore"
            checked={playedBefore}
            onChange={(e) => setPlayedBefore(e.target.checked)}
            className="w-4 h-4 sm:w-5 sm:h-5 rounded-md border-2 border-[#3D5AFE] bg-[#1E1E1E] text-[#3D5AFE] focus:ring-2 focus:ring-[#3D5AFE] focus:ring-offset-0 cursor-pointer transition-all duration-200"
          />
          <label
            htmlFor="playedBefore"
            className="text-[#E0E0E0] text-base sm:text-lg cursor-pointer select-none"
          >
            Lo había jugado antes
          </label>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
          <span className="text-[#E0E0E0] text-base sm:text-lg whitespace-nowrap">Jugado el</span>
          <div className="w-full sm:w-auto">
            <button
              type="button"
              onClick={() => document.getElementById("playedAtInput").showPicker()}
              className="w-full sm:w-auto bg-[#1E1E1E] text-white cursor-pointer text-sm px-4 py-2 rounded-md border border-[#3D3D3D] hover:border-[#3D5AFE] hover:bg-[#2A2A2A] transition-all"
            >
              {formatDate(playedAt)}
            </button>
            <input
              type="date"
              id="playedAtInput"
              value={playedAt}
              onChange={(e) => setPlayedAt(e.target.value)}
              className="absolute top-0 left-0 w-0 h-0 opacity-0 pointer-events-none"
            />
          </div>
        </div>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder="Comparte tu opinión..."
        className={`w-full p-3 bg-[#1E1E1E] text-[#E0E0E0] border-2 border-[#3D3D3D] rounded-lg focus:outline-none focus:border-[#3D5AFE] transition-all duration-300 ${isFocused ? "h-[200px] sm:h-[300px]" : "h-[100px]"}`}
      />

      <div className="flex flex-col items-center sm:items-start gap-4 mt-4">
        <div className="flex justify-center sm:justify-start">
          {[...Array(5)].map((_, index) => {
            const ratingValue = index + 1;
            return (
              <label key={index} className="cursor-pointer">
                <input
                  type="radio"
                  name="rating"
                  className="hidden"
                  value={ratingValue}
                  onClick={() => setRating(ratingValue)}
                />
                <FaStar
                  className="w-6 h-6 sm:w-8 sm:h-8 mr-1"
                  color={ratingValue <= (hover || rating) ? "#3D5AFE" : "#e4e5e9"}
                  onMouseEnter={() => setHover(ratingValue)}
                  onMouseLeave={() => setHover(0)}
                />
              </label>
            );
          })}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto px-6 py-3 bg-[#3D5AFE] text-[#E0E0E0] font-medium rounded-lg hover:bg-[#536DFE] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Publicando..." : "Publicar"}
        </button>
      </div>
    </form>
  );
};

export default ReviewForm;