import React, { useState, useEffect, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import { getUserProfile, followUser, getUserReviews } from "../services/api";
import { useAuth } from "../context/AuthContext";
import ConfirmationModal from "../components/ConfirmationModal";
import {
  FaMapMarkerAlt,
  FaInstagram,
  FaTwitter,
  FaUserFriends,
  FaGamepad,
  FaEnvelope,
} from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingSpinner from "../components/LoadingSpinner";
import ReviewList from "../components/ReviewList";

const UserProfile = () => {
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [showUnfollowModal, setShowUnfollowModal] = useState(false);
  const { user: currentUser } = useAuth();

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

  const [reviews, setReviews] = useState([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);
  const [activeTab, setActiveTab] = useState("info");
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 5;

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
      <ToastContainer />
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
            {currentUser && currentUser.id !== user?.id && (
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

      {/*Contenedor para las reseñas */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
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
                    <span className="text-[#A0A0A0]">Calificaciones</span>
                    <div className="flex items-end justify-between h-40 gap-1 mt-4 px-4">
                      <div className="text-[#A0A0A0] text-sm self-center">
                        ★
                      </div>
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
                            className="flex flex-col items-center gap-2 w-12"
                          >
                            <div className="w-full h-32 relative bg-[#1E1E1E] rounded">
                              <div
                                className="absolute bottom-0 w-full bg-[#3D5AFE] transition-all duration-300 rounded-t"
                                style={{ height: `${percentage}%` }}
                              />
                            </div>
                            <span className="text-[#A0A0A0] text-xs">
                              {count}
                            </span>
                          </div>
                        );
                      })}
                      <div className="text-[#A0A0A0] text-sm self-center">
                        ★★★★★
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-[#E0E0E0]">
                  Todas las Reseñas
                </h3>
              </div>
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
                          className={`px-3 py-1 rounded-md ${
                            currentPage === index + 1
                              ? "bg-[#3D5AFE] text-white"
                              : "bg-[#2C2C2C] text-[#A0A0A0] hover:bg-[#3D5AFE] hover:text-white"
                          }`}
                        >
                          {index + 1}
                        </button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="bg-[#2C2C2C] rounded-lg p-4 text-center text-[#A0A0A0]">
                  No hay reseñas publicadas aún
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
