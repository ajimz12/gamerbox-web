import React, { useState, useEffect, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import { followUser } from "../services/api/users";
import { getUserProfile } from "../services/api/profile";
import { getUserReviews } from "../services/api/reviews";
import { getUserGames } from "../services/api/users";
import { getFavoriteGames, getSuperFavoriteGames } from "../services/api/favorites";
import { useAuth } from "../context/AuthContext";
import ConfirmationModal from "../components/ConfirmationModal";
import {
  FaMapMarkerAlt,
  FaInstagram,
  FaTwitter,
  FaUserFriends,
  FaGamepad,
} from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingSpinner from "../components/LoadingSpinner";
import ReviewList from "../components/ReviewList";
import UserTabs from "../components/UserTabs";
import { getUserLists } from "../services/api/lists";

const UserProfile = () => {
  const { username } = useParams();
  const { user: currentUser } = useAuth();
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFollowLoading, setIsFollowLoading] = useState(false);
  const [showUnfollowModal, setShowUnfollowModal] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);
  const [activeTab, setActiveTab] = useState("info");
  const [currentPage, setCurrentPage] = useState(1);
  const [userGames, setUserGames] = useState([]);
  const [isLoadingGames, setIsLoadingGames] = useState(true);
  const [favoriteGames, setFavoriteGames] = useState([]);
  const [superFavoriteGames, setSuperFavoriteGames] = useState([]);
  const [userLists, setUserLists] = useState([]);
  const [isLoadingLists, setIsLoadingLists] = useState(true);
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

  useEffect(() => {
    if (activeTab === "lists") {
      const fetchUserLists = async () => {
        try {
          setIsLoadingLists(true);
          const data = await getUserLists(username);
          setUserLists(data.lists);
        } catch (error) {
          console.error("Error al cargar las listas:", error);
          toast.error("Error al cargar las listas");
        } finally {
          setIsLoadingLists(false);
        }
      };
      fetchUserLists();
    }
  }, [activeTab, username]);

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
      setIsFollowLoading(true);
      const result = await followUser(user.id);
      setIsFollowing(result.isFollowing);
      setUser((prevUser) => ({
        ...prevUser,
        followers: result.isFollowing
          ? [...(prevUser.followers || []), currentUser]
          : (prevUser.followers || []).filter((f) => f.id !== currentUser.id),
      }));
      
      setShowUnfollowModal(false);
      
      toast.success(
        result.isFollowing
          ? `Ahora sigues a ${user.username}`
          : `Has dejado de seguir a ${user.username}`,
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "dark",
        }
      );
    } catch (error) {
      toast.error("Error al actualizar el seguimiento");
      setShowUnfollowModal(false);
    } finally {
      setIsFollowLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] font-chakra py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Sección de perfil */}
        <div className="bg-[#1E1E1E] rounded-lg overflow-hidden shadow-lg">
          {/* Banner de perfil */}
          <div className="h-64 bg-gradient-to-r from-[#3D5AFE] via-[#5C6BC0] to-[#3D5AFE] relative">
            <div className="absolute bottom-0 left-0 w-full">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
                <div className="flex flex-col sm:flex-row items-center sm:items-end space-y-4 sm:space-y-0 sm:space-x-6">
                  <img
                    src={user?.profilePicture ? `${import.meta.env.VITE_API_URL}${user.profilePicture}` : "/profile_pictures/pfp.png"}
                    alt={`${user?.username}'s profile`}
                    className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-[#3D5AFE] shadow-xl object-cover transform sm:-translate-y-4"
                    onError={(e) => { e.target.src = "/profile_pictures/pfp.png"; }}
                  />
                  <div className="pb-4 text-[#E0E0E0] text-center sm:text-left">
                    <h1 className="text-3xl sm:text-4xl font-bold">{user?.username}</h1>
                    {user?.location && (
                      <div className="flex items-center justify-center sm:justify-start mt-2 text-[#A0A0A0]">
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
              <div className="flex flex-col mb-6">
                {/* Stats container - centered on mobile, left-aligned on desktop */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-wrap justify-center sm:justify-start gap-8 mt-10">
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
                  
                  {/* Button container - centered on mobile, right-aligned on desktop */}
                  <div className="flex justify-center sm:justify-end mt-6 sm:mt-10">
                    {isOwnProfile ? (
                      <Link
                        to="/profile/edit"
                        className="px-6 py-2 bg-[#3D5AFE] text-[#E0E0E0] rounded-full hover:bg-[#5C6BC0] transition-colors w-full sm:w-auto max-w-xs"
                      >
                        Editar Perfil
                      </Link>
                    ) : (
                      currentUser && (
                        <button
                          onClick={handleFollow}
                          disabled={isFollowLoading}
                          className={`px-6 py-2 rounded-full cursor-pointer font-medium w-full sm:w-auto max-w-xs flex items-center justify-center ${
                            isFollowing
                              ? "bg-[#2C2C2C] text-[#E0E0E0] hover:bg-[#1E1E1E]"
                              : "bg-[#3D5AFE] text-[#E0E0E0] hover:bg-[#5C6BC0]"
                          } transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          {isFollowLoading ? (
                            <svg
                              className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                          ) : null}
                          {isFollowLoading ? "" : (isFollowing ? "Dejar de seguir" : "Seguir")}
                        </button>
                      )
                    )}
                  </div>
                </div>
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
                    <ReviewList reviews={reviews} limitToThree={true} />
                  ) : (
                    <div className="bg-[#2C2C2C] rounded-lg p-4 text-center text-[#A0A0A0]">
                      No hay reseñas para mostrar
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor para las pestañas */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <UserTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          reviews={reviews}
          isLoadingReviews={isLoadingReviews}
          userGames={userGames}
          isLoadingGames={isLoadingGames}
          favoriteGames={favoriteGames}
          superFavoriteGames={superFavoriteGames}
          userLists={userLists}
          isLoadingLists={isLoadingLists}
          setCurrentPage={setCurrentPage}
          user={user}
        />
      </div>

      {/* Modal de confirmación para dejar de seguir */}
      <ConfirmationModal
        isOpen={showUnfollowModal}
        onClose={() => setShowUnfollowModal(false)}
        onConfirm={processFollow}
        title="Dejar de seguir"
        message={`¿Estás seguro de que quieres dejar de seguir a ${user?.username}?`}
        confirmText="Dejar de seguir"
        cancelText="Cancelar"
      />

      <ToastContainer />
    </div>
  );
};

export default UserProfile;
