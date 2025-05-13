import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaStar, FaEdit, FaTrash, FaHeart } from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { useAuth } from "../context/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ConfirmationModal from "./ConfirmationModal";
import { deleteReview, updateReview, likeReview } from "../services/api";

const ReviewItem = ({ review, onReviewUpdated, onReviewDeleted }) => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(review.text);
  const [editedRating, setEditedRating] = useState(review.rating);
  const [editedPlayedBefore, setEditedPlayedBefore] = useState(
    review.playedBefore
  );
  const [editedPlayedAt, setEditedPlayedAt] = useState(
    review.playedAt
      ? new Date(review.playedAt).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0]
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [likes, setLikes] = useState(review.likes);
  const [hasLiked, setHasLiked] = useState(review.hasLiked);

  // Actualizar los estados cuando cambia la prop review
  useEffect(() => {
    setEditedText(review.text);
    setEditedRating(review.rating);
    setEditedPlayedBefore(review.playedBefore);
    setEditedPlayedAt(
      review.playedAt
        ? new Date(review.playedAt).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0]
    );
    setLikes(review.likes);
    setHasLiked(review.hasLiked);
  }, [review]);

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

  const handleDelete = async () => {
    try {
      await deleteReview(review.id);

      toast.success("Reseña eliminada con éxito", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      });

      setIsDeleteModalOpen(false);
      onReviewDeleted(review.id);
    } catch (error) {
      toast.error("Error al eliminar la reseña", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
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
        playedAt: editedPlayedAt,
      });

      setIsEditing(false);
      onReviewUpdated(updatedReview);
      toast.success("Reseña actualizada con éxito", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      });
    } catch (error) {
      toast.error("Error al actualizar la reseña", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLike = async () => {
    try {
      const response = await likeReview(review.id);
      setLikes(response.likes);
      setHasLiked(response.hasLiked);
    } catch (error) {
      toast.error("Debes iniciar sesión para dar like", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      });
    }
  };

  return (
    <div className="block bg-[#252525] p-6 rounded-lg group hover:bg-[#2A2A2A] transition-all duration-200 hover:shadow-lg relative">
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <Link
            to={`/user/${review.author.username}`}
            className="flex items-center space-x-3 hover:text-[#3D5AFE] z-10"
          >
            <img
              src={`${import.meta.env.VITE_API_URL}/uploads/profile_pictures/${
                review.author.profilePicture
              }`}
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
            <div className="flex items-center space-x-2 z-10">
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

        <Link
          to={`/reviews/${review.id}`}
          className="block mb-4 z-10"
        >
          <h3 className="text-lg font-semibold text-[#3D5AFE] hover:text-[#5C6BC0] transition-colors">
            {review.gameName}
          </h3>
        </Link>

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
              el{" "}
              {new Date(review.playedAt).toLocaleDateString("es-ES", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </>
          ) : (
            <span className="text-[#3D5AFE] font-medium">
              {review.playedBefore
                ? "Rejugado anteriormente"
                : "Jugado anteriormente"}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={handleLike}
            className={`flex items-center cursor-pointer space-x-2 px-3 py-1 rounded-full transition-colors ${
              hasLiked
                ? "text-red-500 hover:text-red-600"
                : "text-gray-400 hover:text-red-500"
            }`}
          >
            <FaHeart
              className={`${hasLiked ? "fill-current" : "stroke-current"}`}
            />
            <span>{likes}</span>
          </button>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-400">
              {formatDistanceToNow(new Date(review.createdAt), {
                addSuffix: true,
                locale: es,
              })}
            </span>
            <Link
              to={`/reviews/${review.id}`}
              className="text-[#3D5AFE] hover:text-[#536DFE] text-sm transition-colors"
            >
              Ver detalles
            </Link>
          </div>
        </div>
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
