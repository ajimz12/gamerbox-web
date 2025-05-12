import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import ReviewList from "../components/ReviewList";
import { getUserProfile, getUserReviews } from "../services/api";
import {
  FaMapMarkerAlt,
  FaInstagram,
  FaTwitter,
  FaEnvelope,
  FaUserFriends,
  FaGamepad,
} from "react-icons/fa";
import LoadingSpinner from "../components/LoadingSpinner";

const Dashboard = () => {
  const { user, login: updateAuthUser } = useAuth();
  const [userData, setUserData] = useState(user);
  const [reviews, setReviews] = useState([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);
  const [activeTab, setActiveTab] = useState("info");
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 5;

  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const updatedUserData = await getUserProfile(user.username);
        setUserData(updatedUserData);
        updateAuthUser({
          user: updatedUserData,
          token: localStorage.getItem("token"),
        });

        const userReviews = await getUserReviews(user.username);
        setReviews(userReviews);
      } catch (error) {
        console.error("Error al actualizar datos del usuario:", error);
      } finally {
        setIsLoadingReviews(false);
      }
    };

    fetchUserData();
  }, [user.username, updateAuthUser]);

  return (
    <div className="min-h-screen mb-10 bg-[#121212]">
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
                alt={`${user.username}'s profile`}
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
            <div className="flex space-x-8 mt-4">
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
            <Link
              to="/profile/edit"
              className="px-6 py-2 bg-[#3D5AFE] text-[#E0E0E0] rounded-full hover:bg-[#5C6BC0] transition-colors"
            >
              Editar Perfil
            </Link>
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
                <div className="flex items-center text-[#A0A0A0]">
                  <FaEnvelope className="mr-2 text-[#3D5AFE]" />
                  <span>{user?.email}</span>
                </div>
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
                  Mis últimas reseñas
                </h3>
              </div>
              {isLoadingReviews ? (
                <LoadingSpinner />
              ) : reviews.length > 0 ? (
                <ReviewList
                  reviews={reviews.slice(0, 3)}
                  setReviews={setReviews}
                />
              ) : (
                <div className="bg-[#2C2C2C] rounded-lg p-4 text-center text-[#A0A0A0]">
                  No has publicado ninguna reseña aún
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
                  No has publicado ninguna reseña aún
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
