import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  fetchGameDetails,
  fetchGameScreenshots,
} from "../services/rawgService";
import LoadingSpinner from "../components/LoadingSpinner";
import {
  FaCalendarAlt,
  FaGamepad,
  FaImage,
} from "react-icons/fa";
import { BiJoystick } from "react-icons/bi";
import { MdDescription, MdRateReview } from "react-icons/md";
import ReviewForm from "../components/ReviewForm";
import ReviewList from "../components/ReviewList";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

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
      } catch (error) {
        setError("Error al cargar los detalles del juego");
        console.error("Error fetching game details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadGameDetails();
  }, [id]);

  useEffect(() => {
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

    loadReviews();
  }, [id]);

  const handleReviewSubmitted = (newReview) => {
    setReviews([newReview, ...reviews]);
  };

  const handleReviewUpdated = (updatedReview) => {
    setReviews(reviews.map(review => 
      review.id === updatedReview.id ? updatedReview : review
    ));
  };

  const handleReviewDeleted = (reviewId) => {
    setReviews(reviews.filter(review => review.id !== reviewId));
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

  return (
    <div className="min-h-screen bg-[#121212] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#1E1E1E] rounded-lg overflow-hidden shadow-xl">
          {/* Imagen de fondo */}
          <div className="relative h-96">
            <img
              src={game.background_image}
              alt={game.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1E1E1E] to-transparent" />
          </div>

          {/* Contenido principal */}
          <div className="relative -mt-32 p-8">
            <h1 className="text-4xl font-bold text-[#E0E0E0] mb-4 flex items-center mt-10">
              {game.name}
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 mt-10">
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

            <div className="mb-8">
              <h2 className="text-xl font-semibold text-[#E0E0E0] mb-4 flex items-center">
                <MdDescription className="mr-2 text-[#3D5AFE]" />
                Descripción
              </h2>
              <p className="text-[#A0A0A0] leading-relaxed">
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
                <img
                  src={selectedImage || game.background_image_additional}
                  alt={game.name}
                  className="w-full h-[500px] object-cover rounded-lg shadow-lg"
                />
              </div>

              {/* Grid de miniaturas */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {screenshots.slice(0, -1).map((screenshot) => (
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
                ))}
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold text-[#E0E0E0] mb-4 flex items-center">
                <MdRateReview className="mr-2 text-[#3D5AFE]" />
                Reseñas
              </h2>

              {isAuth ? (
                reviews.some(review => review.author.id === currentUser?.id) ? (
                  null
                ) : (
                  <ReviewForm
                    gameId={id}
                    onReviewSubmitted={handleReviewSubmitted}
                  />
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
                <div className="text-center text-[#A0A0A0]">
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
