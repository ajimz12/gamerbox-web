import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { FaTrash } from "react-icons/fa";
import { deleteComment, getReviewComments, createComment } from "../services/api/comments";
import ConfirmationModal from "./ConfirmationModal";

const CommentSection = ({ reviewId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [reviewId]);

  const fetchComments = async () => {
    try {
      const data = await getReviewComments(reviewId);
      setComments(data);
    } catch (error) {
      console.error("Error al cargar los comentarios:", error);
      toast.error("Error al cargar los comentarios");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Debes iniciar sesión para comentar");
      return;
    }
    if (!newComment.trim()) {
      toast.error("El comentario no puede estar vacío");
      return;
    }

    setIsLoading(true);
    try {
      const data = await createComment(reviewId, newComment);
      setComments([...comments, data]);
      setNewComment("");
      toast.success("Comentario publicado con éxito");
    } catch (error) {
      toast.error("Error al publicar el comentario");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!commentToDelete) return;
    
    setIsDeleting(true);
    try {
      await deleteComment(commentToDelete);
      setComments(comments.filter((comment) => comment.id !== commentToDelete));
      toast.success("Comentario eliminado con éxito");
    } catch (error) {
      console.error("Error al eliminar:", error);
      toast.error("Error al eliminar el comentario");
    } finally {
      setIsDeleting(false);
      setCommentToDelete(null);
    }
  };

  return (
    <div>
      {user ? (
        <form onSubmit={handleSubmit} className="mb-6">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Escribe un comentario..."
            className="w-full p-3 bg-[#1E1E1E] text-[#E0E0E0] border-2 border-[#3D3D3D] rounded-lg focus:outline-none focus:border-[#3D5AFE] transition-all duration-300 min-h-[100px]"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="mt-3 px-4 py-2 bg-[#3D5AFE] text-[#E0E0E0] cursor-pointer rounded-lg hover:bg-[#536DFE] transition-colors disabled:opacity-50"
          >
            {isLoading ? "Publicando..." : "Publicar comentario"}
          </button>
        </form>
      ) : (
        <div className="mb-6 p-4 bg-[#1E1E1E] border-2 border-[#3D3D3D] rounded-lg text-center">
          <p className="text-[#E0E0E0]">Debes <a href="/login" className="text-[#3D5AFE] hover:text-[#536DFE] transition-colors">iniciar sesión</a> para poder comentar</p>
        </div>
      )}

      <div className="space-y-4">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="bg-[#1E1E1E] p-4 rounded-lg"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <img
                  src={`${import.meta.env.VITE_API_URL}/uploads/profile_pictures/${
                    comment.author.profilePicture
                  }`}
                  alt={comment.author.username}
                  className="w-8 h-8 rounded-full object-cover"
                  onError={(e) => {
                    e.target.src = "/profile_pictures/pfp.png";
                  }}
                />
                <span className="font-medium text-[#E0E0E0]">
                  {comment.author.username}
                </span>
              </div>
              {user && user.id === comment.author.id && (
                <button
                  onClick={() => setCommentToDelete(comment.id)}
                  className="text-red-500 hover:text-red-600 p-2 cursor-pointer rounded-full hover:bg-[#2A2A2A] transition-colors"
                  title="Eliminar comentario"
                >
                  <FaTrash size={16} />
                </button>
              )}
            </div>
            <p className="text-[#E0E0E0]">{comment.text}</p>
            <span className="text-sm text-[#808080] mt-2 block">
              {new Date(comment.createdAt).toLocaleDateString()}
            </span>
          </div>
        ))}
      </div>

      <ConfirmationModal
        isOpen={commentToDelete !== null}
        onClose={() => setCommentToDelete(null)}
        onConfirm={handleDelete}
        title="¿Estás seguro de que quieres eliminar este comentario?"
        confirmText="Eliminar"
        cancelText="Cancelar"
      />
    </div>
  );
};

export default CommentSection;