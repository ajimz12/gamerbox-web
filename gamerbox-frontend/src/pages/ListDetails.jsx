import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";
import { FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import { deleteList } from "../services/api/lists";
import ConfirmationModal from "../components/ConfirmationModal";

const ListDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [list, setList] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const fetchListDetails = async () => {
      try {
        setIsLoading(true);
        const headers = {};
        if (localStorage.getItem("token")) {
          headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
        }
        
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/lists/${id}`,
          {
            headers
          }
        );

        if (!response.ok) {
          throw new Error("Error al cargar los detalles de la lista");
        }

        const data = await response.json();
        setList(data);
      } catch (error) {
        setError(error.message);
        toast.error(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchListDetails();
  }, [id]);

  if (isLoading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!list) return null;

  const isCreator = user && list.creator.id === parseInt(user.id);

  const handleDelete = async () => {
    try {
      await deleteList(id);
      toast.success("Lista eliminada con éxito");
      navigate(`/user/${user.username}`);
    } catch (error) {
      toast.error("Error al eliminar la lista");
    }
  };

  return (
    <div className="min-h-screen font-chakra bg-[#121212] py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-[#1E1E1E] rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 border-b border-[#2C2C2C]">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-[#E0E0E0] mb-2">
                  {list.title}
                </h1>
                <div className="flex items-center space-x-3 mb-4">
                  <Link
                    to={`/user/${list.creator.username}`}
                    className="flex items-center space-x-2"
                  >
                    <span className="text-[#A0A0A0]">
                      Lista de @{list.creator.username}
                    </span>
                  </Link>
                </div>
                <p className="text-[#808080] text-lg">{list.description}</p>
              </div>
              {isCreator && (
                <div className="flex space-x-2">
                  <Link
                    to={`/lists/${id}/edit`}
                    className="flex items-center space-x-2 bg-[#3D5AFE] text-white px-4 py-2 rounded-lg hover:bg-[#536DFE] transition-colors"
                  >
                    <FaEdit />
                    <span>Editar Lista</span>
                  </Link>
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="flex items-center space-x-2 bg-red-900 cursor-pointer text-white px-4 py-2 rounded-lg hover:bg-red-800 transition-colors"
                  >
                    <FaTrash />
                    <span>Eliminar</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Grid de juegos */}
          <div className="p-6">
            <h2 className="text-xl font-semibold text-[#E0E0E0] mb-4">
              Juegos ({list.games.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {list.games.map((game) => (
                <Link
                  key={game.rawgId}
                  to={`/games/${game.rawgId}`}
                  className="bg-[#252525] rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="relative h-48">
                    <img
                      src={game.backgroundImage}
                      alt={game.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = "/img/placeholder-game.jpg";
                      }}
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-[#E0E0E0] font-semibold">
                      {game.name}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="¿Eliminar Lista?"
        message="¿Estás seguro de que deseas eliminar esta lista? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
      />
    </div>
  );
};

export default ListDetails;
