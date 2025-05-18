import React, { useState, useEffect, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import {
  getUserProfile,
  followUser,
  getUserReviews,
  getUserGames,
  getFavoriteGames,
  getSuperFavoriteGames,
} from "../services/api";
import { useAuth } from "../context/AuthContext";
import ConfirmationModal from "../components/ConfirmationModal";
import {
  FaMapMarkerAlt,
  FaInstagram,
  FaTwitter,
  FaUserFriends,
  FaGamepad,
  FaStar,
  FaEnvelope,
  FaHeart,
} from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingSpinner from "../components/LoadingSpinner";
import ReviewList from "../components/ReviewList";

const UserProfile = () => {
  const { username } = useParams();
  const { user: currentUser } = useAuth();
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [showUnfollowModal, setShowUnfollowModal] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);
  const [activeTab, setActiveTab] = useState("info");
  const [currentPage, setCurrentPage] = useState(1);
  const [userGames, setUserGames] = useState([]);
  const [isLoadingGames, setIsLoadingGames] = useState(true);
  const [favoriteGames, setFavoriteGames] = useState([]);
  const [superFavoriteGames, setSuperFavoriteGames] = useState([]);
  const reviewsPerPage = 5;

  const isOwnProfile = currentUser?.username === username;

  const fetchUserProfile = useCallback(async () => {
    try {
      setIsLoading(true);
      const userData = await getUserProfile(username);
      setUser(userData);
      if (currentUser && userData.followers) {
        const isCurrentUserFollowing = userData.followers.some(
          (follower) => follower.id === parseInt(currentUser.id)
        );
        setIsFollowing(isCurrentUserFollowing);
      }
    } catch (error) {
      setError(error.message || "Error al cargar el perfil del usuario");
    } finally {
      setIsLoading(false);
    }
  }, [username, currentUser]);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);

  const fetchUserReviews = useCallback(async () => {
    try {
      setIsLoadingReviews(true);
      const userReviews = await getUserReviews(username);
      setReviews(userReviews);
    } catch (error) {
      console.error("Error al cargar las reseñas:", error);
    } finally {
      setIsLoadingReviews(false);
    }
  }, [username]);

  useEffect(() => {
    fetchUserReviews();
  }, [fetchUserReviews]);

  const fetchUserGames = useCallback(async () => {
    try {
      setIsLoadingGames(true);
      const games = await getUserGames(username);
      setUserGames(games);
    } catch (error) {
      console.error("Error al cargar el diario de juegos:", error);
    } finally {
      setIsLoadingGames(false);
    }
  }, [username]);

  useEffect(() => {
    fetchUserGames();
  }, [fetchUserGames]);

  useEffect(() => {
    if (activeTab === "favorites") {
      const fetchFavoriteGames = async () => {
        try {
          setIsLoadingGames(true);
          const games = await getFavoriteGames(username);
          setFavoriteGames(games);
        } catch (error) {
          console.error("Error al cargar los juegos favoritos:", error);
          toast.error("Error al cargar los juegos favoritos");
        } finally {
          setIsLoadingGames(false);
        }
      };
      fetchFavoriteGames();
    }
  }, [username, activeTab]);

  useEffect(() => {
    const fetchSuperFavorites = async () => {
      try {
        const games = await getSuperFavoriteGames(username);
        setSuperFavoriteGames(games);
      } catch (error) {
        console.error("Error al cargar los juegos superfavoritos:", error);
      }
    };

    fetchSuperFavorites();
  }, [username]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  const handleFollow = async () => {
    if (isFollowing) {
      setShowUnfollowModal(true);
    } else {
      await processFollow();
    }
  };

  const processFollow = async () => {
    try {
      const result = await followUser(user.id);
      setIsFollowing(result.isFollowing);
      setUser((prevUser) => ({
        ...prevUser,
        followers: result.isFollowing
          ? [...(prevUser.followers || []), currentUser]
          : (prevUser.followers || []).filter((f) => f.id !== currentUser.id),
      }));
      if (result.isFollowing) {
        toast.success(`Ahora sigues a ${user.username}`);
      } else {
        toast.info(`Has dejado de seguir a ${user.username}`);
      }
    } catch (error) {
      setError(error.message || "Error al seguir/dejar de seguir al usuario");
    }
  };

  return (
    <div className="min-h-screen mb-10 bg-[#121212]">
      {showUnfollowModal && (
        <ConfirmationModal
          isOpen={showUnfollowModal}
          onClose={() => setShowUnfollowModal(false)}
          onConfirm={async () => {
            await processFollow();
            setShowUnfollowModal(false);
          }}
          title={`¿Dejar de seguir a ${user.username}?`}
          confirmText="Dejar de seguir"
          cancelText="Cancelar"
          confirmButtonClass="bg-red-500 hover:bg-red-600"
        />
      )}

      {/* Banner de perfil */}
      <div className="h-64 bg-gradient-to-r from-[#3D5AFE] via-[#5C6BC0] to-[#3D5AFE] relative">
        <div className="absolute bottom-0 left-0 w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
            <div className="flex items-end space-x-6">
              <img
                src={
                  user?.profilePicture
                    ? `${import.meta.env.VITE_API_URL}${user.profilePicture}`
                    : "/profile_pictures/pfp.png"
                }
                alt={`${user?.username}'s profile`}
                className="w-32 h-32 rounded-full border-4 border-[#3D5AFE] shadow-xl object-cover transform -translate-y-4"
                onError={(e) => {
                  e.target.src = "/profile_pictures/pfp.png";
                }}
              />
              <div className="pb-4 text-[#E0E0E0]">
                <h1 className="text-4xl font-bold">{user?.username}</h1>
                {user?.location && (
                  <div className="flex items-center mt-2 text-[#A0A0A0]">
                    <FaMapMarkerAlt className="mr-2" />
                    <span>{user.location}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="bg-[#1E1E1E] rounded-lg shadow-lg p-6 border border-[#2C2C2C]">
          <div className="flex justify-between items-center mb-6">
            <div className="flex space-x-8 mt-10">
              <Link
                to={`/user/${user.username}/followers`}
                className="text-center hover:text-[#5C6BC0]"
              >
                <div className="flex items-center justify-center space-x-2">
                  <FaUserFriends className="text-[#3D5AFE] text-xl" />
                  <span className="block text-2xl font-bold text-[#3D5AFE]">
                    {user?.followers?.length || 0}
                  </span>
                </div>
                <span className="text-[#A0A0A0]">Seguidores</span>
              </Link>
              <Link
                to={`/user/${user.username}/following`}
                className="text-center hover:text-[#5C6BC0]"
              >
                <div className="flex items-center justify-center space-x-2">
                  <FaUserFriends className="text-[#3D5AFE] text-xl" />
                  <span className="block text-2xl font-bold text-[#3D5AFE]">
                    {user?.following?.length || 0}
                  </span>
                </div>
                <span className="text-[#A0A0A0]">Siguiendo</span>
              </Link>
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2">
                  <FaGamepad className="text-[#3D5AFE] text-xl" />
                  <span className="block text-2xl font-bold text-[#3D5AFE]">
                    {user?.reviews?.length || 0}
                  </span>
                </div>
                <span className="text-[#A0A0A0]">Juegos</span>
              </div>
            </div>
            {isOwnProfile ? (
              <Link
                to="/profile/edit"
                className="px-6 py-2 bg-[#3D5AFE] text-[#E0E0E0] rounded-full hover:bg-[#5C6BC0] transition-colors"
              >
                Editar Perfil
              </Link>
            ) : (
              currentUser && (
                <button
                  onClick={handleFollow}
                  className={`px-6 py-2 rounded-full cursor-pointer font-medium ${
                    isFollowing
                      ? "bg-[#2C2C2C] text-[#E0E0E0] hover:bg-[#1E1E1E]"
                      : "bg-[#3D5AFE] text-[#E0E0E0] hover:bg-[#5C6BC0]"
                  } transition-colors`}
                >
                  {isFollowing ? "Dejar de seguir" : "Seguir"}
                </button>
              )
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-6">
              {user?.description && (
                <div>
                  <h3 className="text-lg font-semibold text-[#E0E0E0] mb-2">
                    Sobre mí
                  </h3>
                  <p className="text-[#A0A0A0] whitespace-pre-wrap">
                    {user.description}
                  </p>
                </div>
              )}

              <div className="space-y-3">
                {isOwnProfile && (
                  <div className="flex items-center text-[#A0A0A0]">
                    <FaEnvelope className="mr-2 text-[#3D5AFE]" />
                    <span>{user?.email}</span>
                  </div>
                )}
                {user?.instagram_profile && (
                  <a
                    href={`https://instagram.com/${user.instagram_profile.replace(
                      "@",
                      ""
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-[#A0A0A0] hover:text-[#5C6BC0] transition-colors"
                  >
                    <FaInstagram className="mr-2" />
                    <span>{user.instagram_profile.replace("@", "")}</span>
                  </a>
                )}
                {user?.twitter_profile && (
                  <a
                    href={`https://twitter.com/${user.twitter_profile.replace(
                      "@",
                      ""
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-[#A0A0A0] hover:text-[#5C6BC0] transition-colors"
                  >
                    <FaTwitter className="mr-2" />
                    <span>{user.twitter_profile.replace("@", "")}</span>
                  </a>
                )}
              </div>
            </div>

            <div className="md:col-span-2">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-[#E0E0E0]">
                  Últimas reseñas
                </h3>
              </div>
              {isLoadingReviews ? (
                <LoadingSpinner />
              ) : reviews.length > 0 ? (
                <ReviewList reviews={reviews} />
              ) : (
                <div className="bg-[#2C2C2C] rounded-lg p-4 text-center text-[#A0A0A0]">
                  No hay reseñas para mostrar
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor para las reseñas */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* Sección de Juegos Superfavoritos */}
        {superFavoriteGames.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-[#E0E0E0] mb-4">
              Juegos Superfavoritos
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
          <div className="border-b border-[#2C2C2C] mb-6">
            <div className="flex space-x-8">
              <button
                className={`py-4 cursor-pointer text-sm font-medium transition-colors ${
                  activeTab === "info"
                    ? "text-[#3D5AFE] border-b-2 border-[#3D5AFE]"
                    : "text-[#A0A0A0] hover:text-[#E0E0E0]"
                }`}
                onClick={() => setActiveTab("info")}
              >
                Información General
              </button>
              <button
                className={`py-4 text-sm cursor-pointer font-medium transition-colors ${
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
                className={`py-4 text-sm cursor-pointer font-medium transition-colors ${
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
                className={`py-4 text-sm cursor-pointer font-medium transition-colors ${
                  activeTab === "favorites"
                    ? "text-[#3D5AFE] border-b-2 border-[#3D5AFE]"
                    : "text-[#A0A0A0] hover:text-[#E0E0E0]"
                }`}
                onClick={() => setActiveTab("favorites")}
              >
                Favoritos
              </button>
            </div>
          </div>

          {/* Contenido de las pestañas */}
          {activeTab === "info" ? (
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
          ) : null}

          {activeTab === "reviews" && (
            <div>
              {isLoadingReviews ? (
                <LoadingSpinner />
              ) : reviews.length > 0 ? (
                <>
                  <ReviewList
                    reviews={currentReviews}
                    setReviews={setReviews}
                  />
                  {totalPages > 1 && (
                    <div className="flex justify-center mt-6 space-x-2">
                      {[...Array(totalPages)].map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentPage(index + 1)}
                          className={`px-4 py-2 rounded-md ${
                            currentPage === index + 1
                              ? "bg-[#3D5AFE] text-white"
                              : "bg-[#2C2C2C] text-[#A0A0A0] hover:bg-[#3D3D3D]"
                          }`}
                        >
                          {index + 1}
                        </button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center text-[#A0A0A0] py-8">
                  No hay reseñas para mostrar
                </div>
              )}
            </div>
          )}

          {/* Añadir pestaña de Superfavoritos */}
          {activeTab === "superfavorites" && (
            <div>
              {isLoadingGames ? (
                <LoadingSpinner />
              ) : superFavoriteGames.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {superFavoriteGames.map((game) => (
                    <Link
                      key={game.rawgId}
                      to={`/games/${game.rawgId}`}
                      className="bg-[#252525] rounded-lg overflow-hidden group hover:bg-[#2C2C2C] transition-colors"
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
                        <h4 className="text-[#E0E0E0] font-semibold mb-2 group-hover:text-[#3D5AFE] transition-colors">
                          {game.name}
                        </h4>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center text-[#A0A0A0] py-8">
                  No hay juegos superfavoritos para mostrar
                </div>
              )}
            </div>
          )}

          {/* Resto de las pestañas */}
          {activeTab === "diary" && (
            <div>
              {isLoadingGames ? (
                <LoadingSpinner />
              ) : userGames.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userGames.map((game) => (
                    <div
                      key={game.id}
                      className="bg-[#252525] rounded-lg overflow-hidden"
                    >
                      <img
                        src={game.backgroundImage}
                        alt={game.name}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4">
                        <h4 className="text-[#E0E0E0] font-semibold mb-2">
                          {game.name}
                        </h4>
                        <div className="flex items-center text-[#3D5AFE]">
                          <FaStar className="mr-1" />
                          <span>{game.rating}</span>
                        </div>
                        <div className="text-right text-sm text-[#A0A0A0] mt-2">
                          {new Date(game.playedAt).toLocaleDateString("es-ES", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-[#2C2C2C] rounded-lg p-4 text-center text-[#A0A0A0]">
                  No hay juegos en el diario aún
                </div>
              )}
            </div>
          )}

          {activeTab === "favorites" && (
            <div>
              {isLoadingGames ? (
                <LoadingSpinner />
              ) : favoriteGames.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {favoriteGames.map((game) => (
                    <div
                      key={game.id}
                      className="bg-[#252525] rounded-lg overflow-hidden"
                    >
                      <img
                        src={game.backgroundImage}
                        alt={game.name}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4">
                        <h4 className="text-[#E0E0E0] font-semibold mb-2">
                          {game.name}
                        </h4>
                        <div className="flex items-center text-[#3D5AFE]">
                          <FaHeart className="mr-1" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-[#2C2C2C] rounded-lg p-4 text-center text-[#A0A0A0]">
                  No hay juegos favoritos aún
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
