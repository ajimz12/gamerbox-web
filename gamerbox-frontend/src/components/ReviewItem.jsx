import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaStar, FaEdit, FaTrash } from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { useAuth } from "../context/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ConfirmationModal from "./ConfirmationModal";

const ReviewItem = ({ review, onReviewUpdated, onReviewDeleted }) => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(review.text);
  const [editedRating, setEditedRating] = useState(review.rating);
  const [hover, setHover] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleDelete = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/reviews/${review.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Error al eliminar la reseña');
      }

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
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/reviews/${review.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          rating: editedRating,
          text: editedText
        })
      });

      if (!response.ok) {
        throw new Error('Error al actualizar la reseña');
      }

      const updatedReview = await response.json();
      setIsEditing(false); 
      onReviewUpdated(updatedReview);
      toast.success('Reseña actualizada con éxito');
    } catch (error) {
      toast.error('Error al actualizar la reseña');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#252525] p-6 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <Link
          to={`/user/${review.author.username}`}
          className="flex items-center space-x-3 hover:text-[#3D5AFE]"
        >
          <img
            src={`${import.meta.env.VITE_API_URL}/uploads/profile_pictures/${review.author.profilePicture}`}
            alt={review.author.username}
            className="w-10 h-10 rounded-full object-cover"
            onError={(e) => {
              e.target.src = "/profile_pictures/pfp.png";
            }}
          />
          <span className="font-medium text-[#E0E0E0]">
            {review.author.username}
          </span>
        </Link>
        
        {user && user.id === review.author.id && (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="p-2 text-[#E0E0E0] hover:text-[#3D5AFE] cursor-pointer transition-colors"
            >
              <FaEdit />
            </button>
            <button
              onClick={() => setIsDeleteModalOpen(true)}
              className="p-2 text-[#E0E0E0] hover:text-red-500 cursor-pointer transition-colors"
            >
              <FaTrash />
            </button>
          </div>
        )}
      </div>

      <Link to={`/games/${review.gameId}`} className="block mb-4">
        <h3 className="text-lg font-semibold text-[#3D5AFE] hover:text-[#5C6BC0] transition-colors">
          {review.gameName}
        </h3>
      </Link>

      {isEditing ? (
        <div className="space-y-4">
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
          <textarea
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            className="w-full p-3 bg-[#1E1E1E] text-[#E0E0E0] border border-[#3D3D3D] rounded-lg focus:outline-none focus:border-[#3D5AFE] min-h-[100px]"
          />
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
      ) : (
        <>
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
        </>
      )}

      <div className="text-sm text-[#808080]">
        {formatDistanceToNow(new Date(review.createdAt), {
          addSuffix: true,
          locale: es,
        })}
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
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
};

export default ReviewItem;
