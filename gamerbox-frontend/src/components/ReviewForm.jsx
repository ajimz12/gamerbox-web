import React, { useState, useEffect } from 'react';
import { FaStar } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const ReviewForm = ({ gameId, onReviewSubmitted, reviews }) => {
  const { user } = useAuth();
  const [userHasReview, setUserHasReview] = useState(false);

  useEffect(() => {
    if (user && reviews) {
      const hasReview = reviews.some(review => review.author.id === user.id);
      setUserHasReview(hasReview);
    }
  }, [user, reviews]);

  if (userHasReview) {
    return null;
  }
  const [rating, setRating] = useState(0);
  const [text, setText] = useState('');
  const [hover, setHover] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error('Por favor, selecciona una calificación');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          gameId,
          rating,
          text
        })
      });

      if (!response.ok) {
        throw new Error('Error al enviar la reseña');
      }

      const data = await response.json();
      toast.success('¡Reseña publicada con éxito!');
      setText('');
      setRating(0);
      onReviewSubmitted(data);
    } catch (error) {
      toast.error('Error al publicar la reseña');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-[#252525] p-6 rounded-lg mb-6">
      <h3 className="text-lg font-semibold text-[#E0E0E0] mb-4">Escribe tu reseña</h3>
      
      <div className="flex mb-4">
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
                className="w-8 h-8 mr-1"
                color={ratingValue <= (hover || rating) ? "#3D5AFE" : "#e4e5e9"}
                onMouseEnter={() => setHover(ratingValue)}
                onMouseLeave={() => setHover(0)}
              />
            </label>
          );
        })}
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Comparte tu opinión sobre este juego..."
        className="w-full p-3 bg-[#1E1E1E] text-[#E0E0E0] border border-[#3D3D3D] rounded-lg focus:outline-none focus:border-[#3D5AFE] min-h-[100px]"
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-4 px-6 py-2 bg-[#3D5AFE] text-[#E0E0E0] rounded-lg hover:bg-[#5C6BC0] transition-colors disabled:opacity-50"
      >
        {isSubmitting ? 'Publicando...' : 'Publicar Reseña'}
      </button>
    </form>
  );
};

export default ReviewForm;