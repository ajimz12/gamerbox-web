import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  fetchGameDetails,
  fetchGameScreenshots,
} from "../services/rawgService";
import LoadingSpinner from "../components/LoadingSpinner";
import { FaCalendarAlt, FaGamepad, FaImage } from "react-icons/fa";
import { BiJoystick } from "react-icons/bi";
import { MdDescription, MdRateReview } from "react-icons/md";
import ReviewForm from "../components/ReviewForm";
import ReviewList from "../components/ReviewList";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { checkGameFavorite, toggleGameFavorite } from "../services/api/favorites";

const GameDetails = () => {
  const { id } = useParams();
  const { isAuth, user: currentUser } = useAuth();
  const [game, setGame] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [screenshots, setScreenshots] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const loadGameDetails = async () => {
      try {
        setIsLoading(true);
        const [gameData, screenshotsData] = await Promise.all([
          fetchGameDetails(id),
          fetchGameScreenshots(id),
        ]);
        setGame(gameData);
        setScreenshots(screenshotsData);

        if (isAuth) {
          try {
            const data = await checkGameFavorite(id);
            setIsFavorite(data.isFavorite);
          } catch (error) {
            console.error("Error al verificar favorito:", error);
          }
        }

        await loadReviews();
      } catch (error) {
        setError("Error al cargar los detalles del juego");
        console.error("Error fetching game details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadGameDetails();
  }, [id, isAuth]);

  const handleToggleFavorite = async () => {
    if (!isAuth) {
      window.location.href = "/login";
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/games/${id}/favorite`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error al actualizar favorito");
      }

      const data = await response.json();
      setIsFavorite(data.isFavorite);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const loadReviews = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/games/${id}/reviews`
      );
      if (!response.ok) {
        throw new Error("Error al cargar las reseñas");
      }
      const data = await response.json();
      setReviews(data);
    } catch (error) {
      console.error("Error cargando reseñas:", error);
    }
  };

  const handleReviewSubmitted = async (newReview) => {
    await loadReviews();
  };

  const handleReviewUpdated = async (updatedReview) => {
    await loadReviews();
  };

  const handleReviewDeleted = async (reviewId) => {
    await loadReviews();
  };

  if (isLoading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#121212]">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!game) return null;

  const truncatedDescription =
    game.description_raw?.length > 300
      ? `${game.description_raw.substring(0, 300)}...`
      : game.description_raw;

  const defaultImage = "/img/noimage.png";

  return (
    <div className="min-h-screen bg-[#121212] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#1E1E1E] rounded-lg overflow-hidden shadow-xl">
          {/* Imagen de fondo */}
          <div className="relative h-96">
            {game.background_image && (
              <img
                src={game.background_image}
                alt={game.name}
                className="w-full h-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#1E1E1E] to-transparent" />
          </div>

          {/* Contenido principal */}
          <div className="relative -mt-32 p-8">
            <div className="flex justify-between items-center">
              <h1 className="text-4xl font-bold text-[#E0E0E0] mb-4 flex items-center mt-10">
                {game.name}
              </h1>
              <button
                onClick={handleToggleFavorite}
                className="text-2xl text-[#3D5AFE] cursor-pointer hover:text-[#536DFE] transition-colors"
                title={
                  isFavorite ? "Eliminar de favoritos" : "Añadir a favoritos"
                }
              >
                {isFavorite ? <FaHeart /> : <FaRegHeart />}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 font-chakra gap-8 mb-8 mt-10">
              <div className="bg-[#252525] p-6 rounded-lg">
                <h2 className="text-xl font-semibold text-[#E0E0E0] mb-4 flex items-center">
                  <BiJoystick className="mr-2 text-[#3D5AFE]" />
                  Detalles del Juego
                </h2>
                <div className="grid grid-cols-1 gap-4 text-[#A0A0A0]">
                  <div className="bg-[#1E1E1E] p-4 rounded-lg">
                    <div className="flex items-center">
                      <FaCalendarAlt className="mr-3 text-[#3D5AFE] text-xl" />
                      <div>
                        <span className="block text-sm text-[#808080]">
                          Fecha de lanzamiento
                        </span>
                        <span className="text-[#E0E0E0]">
                          {new Date(game.released).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#1E1E1E] p-4 rounded-lg">
                    <div className="flex items-center">
                      <BiJoystick className="mr-3 text-[#3D5AFE] text-xl" />
                      <div>
                        <span className="block text-sm text-[#808080]">
                          Géneros
                        </span>
                        <span className="text-[#E0E0E0]">
                          {game.genres?.map((genre) => genre.name).join(", ")}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#1E1E1E] p-4 rounded-lg">
                    <div className="flex items-center">
                      <FaGamepad className="mr-3 text-[#3D5AFE] text-xl" />
                      <div>
                        <span className="block text-sm text-[#808080]">
                          Plataformas
                        </span>
                        <span className="text-[#E0E0E0]">
                          {game.platforms
                            ?.map((platform) => platform.platform.name)
                            .join(", ")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-8 font-chakra">
              <h2 className="text-xl font-semibold text-[#E0E0E0] mb-4 flex items-center">
                <MdDescription className="mr-2 text-[#3D5AFE]" />
                Descripción
              </h2>
              <p className="text-[#A0A0A0]  leading-relaxed">
                {showFullDescription
                  ? game.description_raw
                  : truncatedDescription}
              </p>
              {game.description_raw?.length > 300 && (
                <button
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className="text-[#3D5AFE] hover:text-[#536DFE] mt-4 cursor-pointer font-medium flex items-center"
                >
                  {showFullDescription ? "Ver menos ↑" : "Ver más ↓"}
                </button>
              )}
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold text-[#E0E0E0] mb-4 flex items-center">
                <FaImage className="mr-2 text-[#3D5AFE]" />
                Galería
              </h2>

              {/* Imagen destacada */}
              <div className="mb-6">
                {(selectedImage || game.background_image_additional) && (
                  <img
                    src={selectedImage || game.background_image_additional}
                    alt={game.name}
                    className="w-full h-[500px] object-cover rounded-lg shadow-lg"
                  />
                )}
              </div>

              {/* Grid de miniaturas */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {screenshots && screenshots.length > 0 ? (
                  screenshots.slice(0, -1).map((screenshot) => (
                    screenshot.image && (
                      <img
                        key={screenshot.id}
                        src={screenshot.image}
                        alt="Screenshot"
                        onClick={() => setSelectedImage(screenshot.image)}
                        className={`w-full h-24 object-cover rounded-lg cursor-pointer transition-all duration-200 ${
                          selectedImage === screenshot.image
                            ? "ring-2 ring-[#3D5AFE]"
                            : "hover:opacity-80"
                        }`}
                      />
                    )
                  ))
                ) : (
                  <p className="text-[#A0A0A0] col-span-full text-center py-4">
                    No hay capturas de pantalla disponibles
                  </p>
                )}
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold text-[#E0E0E0] mb-4 flex items-center justify-between">
                <div className="flex items-center">
                  <MdRateReview className="mr-2 text-[#3D5AFE]" />
                  Reseñas
                </div>
                {isAuth &&
                  !reviews.some(
                    (review) => review.author.id === currentUser?.id
                  ) && (
                    <button
                      onClick={() => setShowReviewModal(true)}
                      className="bg-[#3D5AFE] hover:bg-[#536DFE] text-white cursor-pointer px-4 py-2 rounded-lg flex items-center"
                    >
                      <MdRateReview className="mr-2" />
                      Nueva Reseña
                    </button>
                  )}
              </h2>

              {isAuth ? (
                showReviewModal && (
                  <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex font-chakra items-center justify-center z-50">
                    <div className="bg-[#1E1E1E] rounded-lg p-6 w-full max-w-4xl mx-4">
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-semibold text-[#E0E0E0]">
                          He jugado...
                        </h3>
                        <button
                          onClick={() => setShowReviewModal(false)}
                          className="text-[#A0A0A0] hover:text-white cursor-pointer"
                        >
                          ✕
                        </button>
                      </div>

                      <div className="flex gap-8">
                        <div className="flex-shrink-0">
                          <img
                            src={game.background_image}
                            alt={game.name}
                            className="w-40 h-56 object-cover rounded-lg shadow-lg"
                          />
                        </div>

                        <div className="flex-grow">
                          <div className="mb-4">
                            <h4 className="text-xl font-medium text-[#E0E0E0]">
                              {game.name}
                            </h4>
                            <p className="text-[#A0A0A0] text-base mt-1">
                              {new Date(game.released).getFullYear()}
                            </p>
                          </div>

                          <ReviewForm
                            gameId={id}
                            onReviewSubmitted={(newReview) => {
                              handleReviewSubmitted(newReview);
                              setShowReviewModal(false);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )
              ) : (
                <div className="bg-[#252525] p-6 rounded-lg mb-6 text-center">
                  <p className="text-[#A0A0A0]">
                    <Link
                      to="/login"
                      className="text-[#3D5AFE] hover:text-[#5C6BC0]"
                    >
                      Inicia sesión
                    </Link>{" "}
                    para escribir una reseña
                  </p>
                </div>
              )}

              {reviews.length > 0 ? (
                <ReviewList
                  reviews={reviews}
                  setReviews={setReviews}
                  onReviewUpdated={handleReviewUpdated}
                  onReviewDeleted={handleReviewDeleted}
                />
              ) : (
                <div className="text-center font-chakra text-[#A0A0A0]">
                  No hay reseñas todavía. ¡Sé el primero en escribir una!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameDetails;
