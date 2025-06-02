import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaStar, FaEdit, FaTrash, FaHeart, FaComment } from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ConfirmationModal from "./ConfirmationModal";
import { deleteReview, updateReview, likeReview } from "../services/api/reviews";
import { getReviewComments } from "../services/api/comments";

const ReviewItem = ({ review, onReviewUpdated, onReviewDeleted }) => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(review.text);
  const [editedRating, setEditedRating] = useState(review.rating);
  const [editedPlayedBefore, setEditedPlayedBefore] = useState(review.playedBefore);
  const [editedPlayedAt, setEditedPlayedAt] = useState(
    review.playedAt ? new Date(review.playedAt).toISOString().split("T")[0] : new Date().toISOString().split("T")[0]
  );
  const [hover, setHover] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [likes, setLikes] = useState(review.likes);
  const [hasLiked, setHasLiked] = useState(review.hasLiked);
  const [commentsCount, setCommentsCount] = useState(review.commentsCount || 0);
  const [isLiking, setIsLiking] = useState(false);

  useEffect(() => {
    const fetchCommentsCount = async () => {
      try {
        const comments = await getReviewComments(review.id);
        setCommentsCount(comments.length);
      } catch (error) {
        console.error('Error al obtener los comentarios:', error);
      }
    };

    fetchCommentsCount();
  }, [review.id]);

  useEffect(() => {
    setLikes(review.likes);
    setHasLiked(review.hasLiked);
  }, [review.likes, review.hasLiked]);

  const formatDate = (dateString) => {
    const months = [
      "Ene", "Feb", "Mar", "Abr", "May", "Jun",
      "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"
    ];
    const date = new Date(dateString);
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const handleDelete = async () => {
    try {
      await deleteReview(review.id);
      
      toast.success('Reseña eliminada con éxito', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark"
      });
      
      setIsDeleteModalOpen(false);
      onReviewDeleted(review.id);
    } catch (error) {
      toast.error('Error al eliminar la reseña', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark"
      });
    }
  };

  const handleUpdate = async () => {
    setIsSubmitting(true);
    try {
      const updatedReview = await updateReview(review.id, {
        rating: editedRating,
        text: editedText,
        playedBefore: editedPlayedBefore,
        playedAt: editedPlayedAt
      });
      
      setIsEditing(false);
      onReviewUpdated(updatedReview);
      toast.success('Reseña actualizada con éxito', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark"
      });
    } catch (error) {
      toast.error('Error al actualizar la reseña', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLike = async () => {
    if (!user) {
      toast.error('Inicia sesion para dar likes', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark"
      });
      return;
    }
    
    setIsLiking(true);
    try {
      const response = await likeReview(review.id);
      setLikes(response.likes);
      setHasLiked(response.hasLiked);
    } catch (error) {
      toast.error('Error al dar like', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark"
      });
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <div className="bg-[#252525] p-4 sm:p-6 font-chakra rounded-lg">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-4">
        <Link
          to={`/user/${review.author.username}`}
          className="flex items-center space-x-3 hover:text-[#3D5AFE]"
        >
          <img
            src={`${import.meta.env.VITE_API_URL}/uploads/profile_pictures/${review.author.profilePicture}`}
            alt={review.author.username}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
            onError={(e) => {
              e.target.src = "/profile_pictures/pfp.png";
            }}
          />
          <span className="font-medium text-sm sm:text-base text-[#E0E0E0]">
            {review.author.username}
          </span>
        </Link>
        
        <div className="flex items-center space-x-2 text-sm sm:text-base">
          {user && user.id === review.author.id && (
            <>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="p-1.5 sm:p-2 text-[#E0E0E0] hover:text-[#3D5AFE] cursor-pointer transition-colors"
              >
                <FaEdit />
              </button>
              <button
                onClick={() => setIsDeleteModalOpen(true)}
                className="p-1.5 sm:p-2 text-[#E0E0E0] hover:text-red-500 cursor-pointer transition-colors"
              >
                <FaTrash />
              </button>
            </>
          )}
          {user?.roles?.includes("ROLE_ADMIN") && user.id !== review.author.id && (
            <button
              onClick={() => setIsDeleteModalOpen(true)}
              className="p-1.5 sm:p-2 text-[#E0E0E0] hover:text-red-500 cursor-pointer transition-colors"
            >
              <FaTrash />
            </button>
          )}
          <Link
            to={`/reviews/${review.id}`}
            className="p-1.5 sm:p-2 text-[#E0E0E0] hover:text-[#3D5AFE] cursor-pointer transition-colors"
          >
            Ver detalles
          </Link>
        </div>
      </div>

      <Link to={`/games/${review.gameId}`} className="block mb-4">
        <h3 className="text-lg font-semibold text-[#3D5AFE] hover:text-[#5C6BC0] transition-colors">
          {review.gameName}
        </h3>
      </Link>

      {isEditing && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#1E1E1E] rounded-lg p-6 w-full max-w-4xl mx-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-[#E0E0E0]">
                Editar reseña
              </h3>
              <button
                onClick={() => setIsEditing(false)}
                className="text-[#A0A0A0] hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="mb-6 grid grid-cols-2 gap-6">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="editPlayedBefore"
                  checked={editedPlayedBefore}
                  onChange={(e) => setEditedPlayedBefore(e.target.checked)}
                  className="w-5 h-5 rounded-md border-2 border-[#3D5AFE] bg-[#1E1E1E] text-[#3D5AFE] focus:ring-2 focus:ring-[#3D5AFE] focus:ring-offset-0 cursor-pointer transition-all duration-200"
                />
                <label
                  htmlFor="editPlayedBefore"
                  className="text-[#E0E0E0] text-lg cursor-pointer select-none"
                >
                  Lo había jugado antes
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-[#E0E0E0] text-lg">Jugado el</span>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() =>
                      document.getElementById("editPlayedAtInput").showPicker()
                    }
                    className="bg-[#1E1E1E] text-white cursor-pointer text-sm px-4 py-2 rounded-md border border-[#3D3D3D] hover:border-[#3D5AFE] hover:bg-[#2A2A2A] transition-all"
                  >
                    {formatDate(editedPlayedAt)}
                  </button>
                  <input
                    type="date"
                    id="editPlayedAtInput"
                    value={editedPlayedAt}
                    onChange={(e) => setEditedPlayedAt(e.target.value)}
                    className="absolute top-0 left-0 w-0 h-0 opacity-0 pointer-events-none"
                  />
                </div>
              </div>
            </div>

            <textarea
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              className="w-full p-3 bg-[#1E1E1E] text-[#E0E0E0] border-2 border-[#3D3D3D] rounded-lg focus:outline-none focus:border-[#3D5AFE] min-h-[200px]"
            />

            <div className="flex mt-4 mb-6">
              {[...Array(5)].map((_, index) => {
                const ratingValue = index + 1;
                return (
                  <label key={index} className="cursor-pointer">
                    <input
                      type="radio"
                      name="rating"
                      className="hidden"
                      value={ratingValue}
                      onClick={() => setEditedRating(ratingValue)}
                    />
                    <FaStar
                      className="w-8 h-8 mr-1"
                      color={ratingValue <= (hover || editedRating) ? "#3D5AFE" : "#e4e5e9"}
                      onMouseEnter={() => setHover(ratingValue)}
                      onMouseLeave={() => setHover(0)}
                    />
                  </label>
                );
              })}
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-[#E0E0E0] bg-[#2C2C2C] rounded-lg hover:bg-[#1E1E1E] transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleUpdate}
                disabled={isSubmitting}
                className="px-4 py-2 bg-[#3D5AFE] text-[#E0E0E0] rounded-lg hover:bg-[#5C6BC0] transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center mb-4">
        {[...Array(5)].map((_, index) => (
          <FaStar
            key={index}
            className="w-5 h-5"
            color={index < review.rating ? "#3D5AFE" : "#e4e5e9"}
          />
        ))}
      </div>
      <p className="text-[#A0A0A0] mb-4">{review.text}</p>
      <div className="text-sm text-[#808080] mb-4">
        {review.playedAt ? (
          <>
            {review.playedBefore ? (
              <span className="text-[#3D5AFE] font-medium">Rejugado</span>
            ) : (
              <span className="text-[#3D5AFE] font-medium">Jugado</span>
            )}{" "}
            el {new Date(review.playedAt).toLocaleDateString('es-ES', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}
          </>
        ) : (
          <span className="text-[#3D5AFE] font-medium">
            {review.playedBefore ? 'Rejugado anteriormente' : 'Jugado anteriormente'}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleLike}
            disabled={isLiking}
            className={`flex items-center cursor-pointer space-x-2 px-2 sm:px-3 py-1 rounded-full transition-colors text-sm sm:text-base ${
              hasLiked
                ? "text-red-500 hover:text-red-600"
                : "text-gray-400 hover:text-red-500"
            } ${isLiking ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isLiking ? (
              <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <FaHeart className={`${hasLiked ? "fill-current" : "stroke-current"} w-4 h-4 sm:w-5 sm:h-5`} />
            )}
            <span>{likes}</span>
          </button>

          <div className="flex items-center space-x-2 text-gray-400 hover:text-[#3D5AFE] transition-colors text-sm sm:text-base">
            <Link to={`/reviews/${review.id}`} className="flex items-center space-x-2">
              <FaComment className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>{commentsCount}</span>
            </Link>
          </div>
        </div>

        <span className="text-xs sm:text-sm text-gray-400">
          {formatDistanceToNow(new Date(review.createdAt), {
            addSuffix: true,
            locale: es,
          })}
        </span>
      </div>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="¿Estás seguro de que deseas eliminar esta reseña?"
        confirmText="Eliminar"
        cancelText="Cancelar"
        confirmButtonClass="bg-red-600 hover:bg-red-700"
      />
    </div>
  );
};

export default ReviewItem;