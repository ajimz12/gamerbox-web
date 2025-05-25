import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaStar, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import LoadingSpinner from "./LoadingSpinner";
import ReviewList from "./ReviewList";
import ListCard from "./ListCard";

const UserTabs = ({
  activeTab,
  setActiveTab,
  reviews,
  isLoadingReviews,
  userGames,
  isLoadingGames,
  favoriteGames,
  superFavoriteGames,
  userLists,
  isLoadingLists,
  setCurrentPage,
  user,
}) => {
  const ITEMS_PER_PAGE = 5;
  const [currentPages, setCurrentPages] = useState({
    reviews: 1,
    diary: 1,
    favorites: 1,
    lists: 1,
  });

  const handlePageChange = (tab, page) => {
    setCurrentPages((prev) => ({
      ...prev,
      [tab]: page,
    }));
  };

  const renderPagination = (tab, items) => {
    const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);
    const currentPage = currentPages[tab];

    if (totalPages <= 1) return null;

    return (
      <div className="flex justify-center items-center space-x-4 mt-6">
        <button
          onClick={() => handlePageChange(tab, currentPage - 1)}
          disabled={currentPage === 1}
          className={`p-2 rounded-full ${
            currentPage === 1
              ? "text-[#808080] cursor-not-allowed"
              : "text-[#3D5AFE] hover:bg-[#2C2C2C]"
          }`}
        >
          <FaChevronLeft />
        </button>
        <span className="text-[#E0E0E0]">
          Página {currentPage} de {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(tab, currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`p-2 rounded-full ${
            currentPage === totalPages
              ? "text-[#808080] cursor-not-allowed"
              : "text-[#3D5AFE] hover:bg-[#2C2C2C]"
          }`}
        >
          <FaChevronRight />
        </button>
      </div>
    );
  };

  const getPaginatedItems = (items, tab) => {
    const startIndex = (currentPages[tab] - 1) * ITEMS_PER_PAGE;
    return items.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  };

  return (
    <>
      {/* Sección de Juegos Superfavoritos */}
      {superFavoriteGames.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-[#E0E0E0] mb-4">
            Superfavoritos
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {superFavoriteGames.map((game) => (
              <Link
                key={game.rawgId}
                to={`/games/${game.rawgId}`}
                className="bg-[#1E1E1E] rounded-lg overflow-hidden hover:transform hover:scale-105 transition-transform duration-200 border border-[#3D5AFE]"
              >
                <div className="relative">
                  <img
                    src={game.backgroundImage}
                    alt={game.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <FaStar className="text-[#3D5AFE] text-2xl" />
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-[#E0E0E0] font-semibold truncate">
                    {game.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="bg-[#1E1E1E] rounded-lg shadow-lg p-6 border border-[#2C2C2C]">
        {/* Pestañas */}
        <div className="border-b border-[#2C2C2C] mb-6 overflow-x-auto">
          <div className="flex flex-nowrap min-w-max sm:min-w-0 sm:flex-wrap gap-2 sm:gap-4 pb-1">
            <button
              className={`py-3 px-4 whitespace-nowrap text-sm cursor-pointer font-medium transition-colors ${
                activeTab === "info"
                  ? "text-[#3D5AFE] border-b-2 border-[#3D5AFE]"
                  : "text-[#A0A0A0] hover:text-[#E0E0E0]"
              }`}
              onClick={() => setActiveTab("info")}
            >
              Información General
            </button>
            <button
              className={`py-3 px-4 whitespace-nowrap text-sm cursor-pointer font-medium transition-colors ${
                activeTab === "reviews"
                  ? "text-[#3D5AFE] border-b-2 border-[#3D5AFE]"
                  : "text-[#A0A0A0] hover:text-[#E0E0E0]"
              }`}
              onClick={() => {
                setActiveTab("reviews");
                setCurrentPage(1);
              }}
            >
              Todas las Reseñas
            </button>
            <button
              className={`py-3 px-4 whitespace-nowrap text-sm cursor-pointer font-medium transition-colors ${
                activeTab === "diary"
                  ? "text-[#3D5AFE] border-b-2 border-[#3D5AFE]"
                  : "text-[#A0A0A0] hover:text-[#E0E0E0]"
              }`}
              onClick={() => {
                setActiveTab("diary");
              }}
            >
              Diario de Juegos
            </button>
            <button
              className={`py-3 px-4 whitespace-nowrap text-sm cursor-pointer font-medium transition-colors ${
                activeTab === "favorites"
                  ? "text-[#3D5AFE] border-b-2 border-[#3D5AFE]"
                  : "text-[#A0A0A0] hover:text-[#E0E0E0]"
              }`}
              onClick={() => setActiveTab("favorites")}
            >
              Favoritos
            </button>
            <button
              className={`py-3 px-4 whitespace-nowrap text-sm cursor-pointer font-medium transition-colors ${
                activeTab === "lists"
                  ? "text-[#3D5AFE] border-b-2 border-[#3D5AFE]"
                  : "text-[#A0A0A0] hover:text-[#E0E0E0]"
              }`}
              onClick={() => setActiveTab("lists")}
            >
              Listas
            </button>
          </div>
        </div>

        {/* Contenido de las pestañas */}
        <div className="p-6">
          {activeTab === "info" && (
            <div>
              <h3 className="text-lg font-semibold text-[#E0E0E0] mb-4">
                Estadísticas de {user.username}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#2C2C2C] p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-[#A0A0A0]">Total de reseñas</span>
                    <span className="text-[#3D5AFE] font-bold">
                      {reviews.length}
                    </span>
                  </div>
                </div>

                <div className="bg-[#2C2C2C] p-4 rounded-lg col-span-2">
                  <div className="space-y-2">
                    <div className="flex items-end justify-between h-40 gap-0.5 mt-10 px-4">
                      {[1, 2, 3, 4, 5].map((rating) => {
                        const count = reviews.filter(
                          (review) => Math.round(review.rating) === rating
                        ).length;
                        const percentage =
                          reviews.length > 0
                            ? (count / reviews.length) * 100
                            : 0;

                        return (
                          <div
                            key={rating}
                            className="flex flex-col items-center gap-2 w-10"
                          >
                            <div className="w-full h-32 relative">
                              <div
                                className={`absolute bottom-0 w-full transition-all duration-300 rounded-t ${
                                  count > 0
                                    ? "bg-[#3D5AFE]"
                                    : "bg-[#3D5AFE] bg-opacity-10"
                                }`}
                                style={{
                                  height: count > 0 ? `${percentage}%` : "10%",
                                }}
                              />
                            </div>
                            <div className="text-[#A0A0A0] text-xs">
                              {"★".repeat(rating)}
                            </div>
                            <span className="text-[#A0A0A0] text-xs">
                              {count}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "reviews" && (
            <div>
              {isLoadingReviews ? (
                <LoadingSpinner />
              ) : reviews.length > 0 ? (
                <>
                  <ReviewList reviews={getPaginatedItems(reviews, "reviews")} />
                  {renderPagination("reviews", reviews)}
                </>
              ) : (
                <div className="bg-[#2C2C2C] rounded-lg p-4 text-center text-[#A0A0A0]">
                  No hay reseñas para mostrar
                </div>
              )}
            </div>
          )}

          {activeTab === "diary" && (
            <div>
              {isLoadingGames ? (
                <LoadingSpinner />
              ) : userGames.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {getPaginatedItems(userGames, "diary").map((game) => (
                      <Link
                        key={game.rawgId}
                        to={`/games/${game.rawgId}`}
                        className="bg-[#2C2C2C] rounded-lg overflow-hidden hover:transform hover:scale-105 transition-transform duration-200"
                      >
                        <img
                          src={game.backgroundImage}
                          alt={game.name}
                          className="w-full h-48 object-cover"
                        />
                        <div className="p-4">
                          <h3 className="text-[#E0E0E0] font-semibold truncate">
                            {game.name}
                          </h3>
                          <div className="flex items-center text-[#3D5AFE]">
                            <FaStar className="mr-1" />
                            <span>{game.rating}</span>
                          </div>
                          <div className="text-right text-sm text-[#A0A0A0] mt-2">
                            {new Date(game.playedAt).toLocaleDateString(
                              "es-ES",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                  {renderPagination("diary", userGames)}
                </>
              ) : (
                <div className="bg-[#2C2C2C] rounded-lg p-4 text-center text-[#A0A0A0]">
                  No hay juegos en el diario
                </div>
              )}
            </div>
          )}

          {activeTab === "favorites" && (
            <div>
              {isLoadingGames ? (
                <LoadingSpinner />
              ) : favoriteGames.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {getPaginatedItems(favoriteGames, "favorites").map(
                      (game) => (
                        <Link
                          key={game.rawgId}
                          to={`/games/${game.rawgId}`}
                          className="bg-[#2C2C2C] rounded-lg overflow-hidden hover:transform hover:scale-105 transition-transform duration-200"
                        >
                          <img
                            src={game.backgroundImage}
                            alt={game.name}
                            className="w-full h-48 object-cover"
                          />
                          <div className="p-4">
                            <h3 className="text-[#E0E0E0] font-semibold truncate">
                              {game.name}
                            </h3>
                          </div>
                        </Link>
                      )
                    )}
                  </div>
                  {renderPagination("favorites", favoriteGames)}
                </>
              ) : (
                <div className="bg-[#2C2C2C] rounded-lg p-4 text-center text-[#A0A0A0]">
                  No hay juegos favoritos
                </div>
              )}
            </div>
          )}

          {activeTab === "lists" && (
            <div>
              {isLoadingLists ? (
                <LoadingSpinner />
              ) : (
                <>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-[#E0E0E0]">
                      Mis Listas
                    </h3>
                    <Link
                      to="/create-list"
                      className="flex items-center space-x-2 bg-[#3D5AFE] text-white px-4 py-2 rounded-lg hover:bg-[#536DFE] transition-colors"
                      onClick={() => window.scrollTo(0, 0)}
                    >
                      <span>Crear Lista</span>
                    </Link>
                  </div>
                  {userLists.length > 0 ? (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {getPaginatedItems(userLists, "lists").map((list) => (
                          <ListCard key={list.id} list={list} />
                        ))}
                      </div>
                      {renderPagination("lists", userLists)}
                    </>
                  ) : (
                    <div className="bg-[#2C2C2C] rounded-lg p-4 text-center text-[#A0A0A0]">
                      No hay listas para mostrar
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default UserTabs;
