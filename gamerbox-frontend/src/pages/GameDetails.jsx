import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  fetchGameDetails,
  fetchGameScreenshots,
} from "../services/rawgService";
import LoadingSpinner from "../components/LoadingSpinner";
// Importamos los iconos necesarios de react-icons
import {
  FaCalendarAlt,
  FaGamepad,
  FaCode,
  FaStar,
  FaImage,
} from "react-icons/fa";
import { BiJoystick } from "react-icons/bi";
import { MdDescription, MdRateReview } from "react-icons/md";

const GameDetails = () => {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [screenshots, setScreenshots] = useState([]);

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

              <div className="bg-[#252525] rounded-lg p-6 mb-6 hover:bg-[#2A2A2A] transition-colors duration-200">
                <h3 className="text-lg font-semibold text-[#E0E0E0] mb-4 flex items-center">
                  <FaStar className="mr-2 text-[#3D5AFE]" />
                  Escribe tu reseña
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-[#A0A0A0] mb-2 font-medium">
                      Puntuación
                    </label>
                    <div className="flex space-x-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          className="text-2xl text-[#3D5AFE] hover:text-[#536DFE] transition-colors duration-200 cursor-not-allowed"
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-[#A0A0A0] mb-2 font-medium">
                      Tu opinión
                    </label>
                    <textarea
                      className="w-full bg-[#1E1E1E] text-[#E0E0E0] rounded-lg p-4 border border-[#3D5AFE] focus:ring-2 focus:ring-[#536DFE] transition-all duration-200 cursor-not-allowed"
                      rows="4"
                      placeholder="Comparte tu experiencia con este juego..."
                      disabled
                    ></textarea>
                  </div>
                  <button
                    className="bg-[#3D5AFE] text-[#E0E0E0] px-6 py-3 rounded-lg font-medium opacity-50 cursor-not-allowed hover:bg-[#536DFE] transition-colors duration-200 flex items-center justify-center"
                    disabled
                  >
                    <FaStar className="mr-2" />
                    Publicar reseña
                  </button>
                </div>
              </div>

              {/* Lista de reseñas */}
              <div className="space-y-6">
                <div className="bg-[#252525] rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-10 h-10 bg-[#3D5AFE] rounded-full flex items-center justify-center">
                        <span className="text-[#E0E0E0] font-bold">U</span>
                      </div>
                      <span className="text-[#E0E0E0] font-medium">
                        Usuario
                      </span>
                    </div>
                    <div className="flex text-[#3D5AFE]">★★★★★</div>
                  </div>
                  <p className="text-[#A0A0A0]">
                    Esta es una reseña de ejemplo.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameDetails;
