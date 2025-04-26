import React from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaInstagram,
  FaTwitter,
  FaEnvelope,
  FaUserFriends,
  FaGamepad,
} from "react-icons/fa";

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Banner de perfil */}
      <div className="h-64 bg-gradient-to-r from-indigo-800 via-violet-700 to-purple-800 relative">
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
                className="w-32 h-32 rounded-full border-4 border-white shadow-xl object-cover transform -translate-y-4"
                onError={(e) => {
                  e.target.src = "/profile_pictures/pfp.png";
                }}
              />
              <div className="pb-4 text-white">
                <h1 className="text-4xl font-bold">{user?.username}</h1>
                {user?.location && (
                  <div className="flex items-center mt-2 text-gray-200">
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
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex space-x-8 mt-4">
              <Link to={`/user/${user.username}/followers`} className="text-center hover:text-violet-700">
                <div className="flex items-center justify-center space-x-2">
                  <FaUserFriends className="text-violet-500 text-xl" />
                  <span className="block text-2xl font-bold text-violet-600">
                    {user?.followers?.length || 0}
                  </span>
                </div>
                <span className="text-gray-600">Seguidores</span>
              </Link>
              <Link to={`/user/${user.username}/following`} className="text-center hover:text-violet-700">
                <div className="flex items-center justify-center space-x-2">
                  <FaUserFriends className="text-violet-500 text-xl" />
                  <span className="block text-2xl font-bold text-violet-600">
                    {user?.following?.length || 0}
                  </span>
                </div>
                <span className="text-gray-600">Siguiendo</span>
              </Link>
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2">
                  <FaGamepad className="text-violet-500 text-xl" />
                  <span className="block text-2xl font-bold text-violet-600">
                    {user?.reviews?.length || 0}
                  </span>
                </div>
                <span className="text-gray-600">Juegos</span>
              </div>
            </div>
            <Link
              to="/profile/edit"
              className="px-6 py-2 bg-violet-600 text-white rounded-full hover:bg-violet-700 transition-colors"
            >
              Editar Perfil
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Columna de información */}
            <div className="space-y-6">
              {user?.description && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Sobre mí
                  </h3>
                  <p className="text-gray-600 whitespace-pre-wrap">
                    {user.description}
                  </p>
                </div>
              )}

              <div className="space-y-3">
                <div className="flex items-center text-gray-600">
                  <FaEnvelope className="mr-2 text-violet-500" />
                  <span>{user?.email}</span>
                </div>
                {user?.instagram_profile && (
                  <a
                    href={`https://instagram.com/${user.instagram_profile.replace("@", "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-gray-600 hover:text-violet-500 transition-colors"
                  >
                    <FaInstagram className="mr-2" />
                    <span>{user.instagram_profile.replace("@", "")}</span>
                  </a>
                )}
                {user?.twitter_profile && (
                  <a
                    href={`https://twitter.com/${user.twitter_profile.replace("@", "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-gray-600 hover:text-violet-500 transition-colors"
                  >
                    <FaTwitter className="mr-2" />
                    <span>{user.twitter_profile.replace("@", "")}</span>
                  </a>
                )}
              </div>
            </div>

            {/* Columna de actividad reciente */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Actividad Reciente
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 text-center text-gray-600">
                No hay actividad reciente para mostrar
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
