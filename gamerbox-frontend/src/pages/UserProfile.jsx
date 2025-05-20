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
} from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingSpinner from "../components/LoadingSpinner";
import ReviewList from "../components/ReviewList";
import UserTabs from "../components/UserTabs";

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
          const response = await fetch(
            `${import.meta.env.VITE_API_URL}/api/users/${username}/lists`
          );
          if (!response.ok) {
            throw new Error("Error al cargar las listas");
          }
          const data = await response.json();
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
    <div className="min-h-screen bg-[#121212] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Sección de perfil */}
        <div className="bg-[#1E1E1E] rounded-lg overflow-hidden shadow-lg">
          {/* Banner de perfil */}
          <div className="h-64 bg-gradient-to-r from-[#3D5AFE] via-[#5C6BC0] to-[#3D5AFE] relative">
            <div className="absolute bottom-0 left-0 w-full">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
                <div className="flex items-end space-x-6">
                  <img
                    src={
                      user?.profilePicture
                        ? `${import.meta.env.VITE_API_URL}${
                            user.profilePicture
                          }`
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
