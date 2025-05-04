import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  fetchGameDetails,
  fetchGameScreenshots,
} from "../services/rawgService";
import LoadingSpinner from "../components/LoadingSpinner";

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
            <h1 className="text-4xl font-bold text-[#E0E0E0] mb-4">
              {game.name}
            </h1>

            {/* Metascore */}
            {game.metacritic && (
              <div className="inline-block bg-[#3D5AFE] text-[#E0E0E0] px-3 py-1 rounded-full text-sm font-semibold mb-4">
                Metascore: {game.metacritic}
              </div>
            )}

            {/* Detalles básicos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h2 className="text-xl font-semibold text-[#E0E0E0] mb-2">
                  Detalles
                </h2>
                <div className="space-y-2 text-[#A0A0A0]">
                  <p>
                    Fecha de lanzamiento:{" "}
                    {new Date(game.released).toLocaleDateString()}
                  </p>
                  <p>
                    Géneros:{" "}
                    {game.genres?.map((genre) => genre.name).join(", ")}
                  </p>
                  <p>
                    Plataformas:{" "}
                    {game.platforms
                      ?.map((platform) => platform.platform.name)
                      .join(", ")}
                  </p>
                  <p>
                    Desarrolladores:{" "}
                    {game.developers?.map((dev) => dev.name).join(", ")}
                  </p>
                </div>
              </div>
            </div>

            {/* Descripción */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-[#E0E0E0] mb-2">
                Descripción
              </h2>
              <p className="text-[#A0A0A0]">
                {showFullDescription
                  ? game.description_raw
                  : truncatedDescription}
              </p>
              {game.description_raw?.length > 300 && (
                <button
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className="text-[#3D5AFE] hover:text-[#536DFE] mt-2 cursor-pointer font-medium"
                >
                  {showFullDescription ? "Ver menos" : "Ver más"}
                </button>
              )}
            </div>

            {/* Galería de imágenes */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-[#E0E0E0] mb-4">
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
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {game.background_image_additional && (
                  <img
                    src={game.background_image_additional}
                    alt="Adicional"
                    onClick={() =>
                      setSelectedImage(game.background_image_additional)
                    }
                    className={`w-full h-24 object-cover rounded-lg cursor-pointer transition-all duration-200 ${
                      selectedImage === game.background_image_additional
                        ? "ring-2 ring-[#3D5AFE]"
                        : "hover:opacity-80"
                    }`}
                  />
                )}
                {screenshots.map((screenshot) => (
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

            {/* Sección de Reseñas */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-[#E0E0E0] mb-4">
                Reseñas
              </h2>
              
              {/* Formulario de reseña */}
              <div className="bg-[#252525] rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-[#E0E0E0] mb-4">
                  Escribe tu reseña
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-[#A0A0A0] mb-2">
                      Puntuación
                    </label>
                    <div className="flex space-x-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          className="text-2xl text-[#3D5AFE] cursor-not-allowed"
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-[#A0A0A0] mb-2">
                      Tu opinión
                    </label>
                    <textarea
                      className="w-full bg-[#1E1E1E] text-[#E0E0E0] rounded-lg p-3 cursor-not-allowed"
                      rows="4"
                      placeholder="Comparte tu experiencia con este juego..."
                      disabled
                    ></textarea>
                  </div>
                  <button
                    className="bg-[#3D5AFE] text-[#E0E0E0] px-6 py-2 rounded-lg font-medium opacity-50 cursor-not-allowed"
                    disabled
                  >
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
                      <span className="text-[#E0E0E0] font-medium">Usuario</span>
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
