import { Link } from "react-router-dom";
import { useState } from "react";
import { IoExitOutline } from "react-icons/io5";
import { IoMenu, IoClose } from "react-icons/io5";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner";
import ConfirmationModal from "./ConfirmationModal";

import React from "react";

const Navbar = () => {
  const { isAuth, user, logout } = useAuth();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    logout();
    setShowLogoutConfirm(false);
    navigate("/login");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <nav className="bg-[#1E1E1E] text-[#E0E0E0] shadow-lg border-b border-[#2C2C2C]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/" className="flex items-center space-x-2 cursor-pointer">
              <span className="font-bold text-xl">GamerBox</span>
            </Link>

            <button
              onClick={toggleMenu}
              className="md:hidden p-2 rounded-md hover:bg-[#5C6BC0] transition-colors"
            >
              {isMenuOpen ? (
                <IoClose className="h-6 w-6" />
              ) : (
                <IoMenu className="h-6 w-6" />
              )}
            </button>

            <div className="hidden md:flex items-center space-x-4">
              <Link
                to="/users"
                className="px-4 py-2 hover:bg-[#5C6BC0] rounded-md transition-colors"
              >
                Miembros
              </Link>
              <Link
                to="/games"
                className="px-4 py-2 hover:bg-[#5C6BC0] rounded-md transition-colors"
              >
                Juegos
              </Link>
              {isAuth ? (
                <>
                  <Link
                    to="/dashboard"
                    className="flex items-center space-x-3 bg-[#3D5AFE] hover:bg-[#5C6BC0] px-4 py-2 rounded-md transition-colors"
                  >
                    <span className="font-medium">{user?.username}</span>
                    <div className="relative w-8 h-8">
                      {imageLoading && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <LoadingSpinner size="small" />
                        </div>
                      )}
                      <img
                        src={
                          user?.profilePicture
                            ? `${import.meta.env.VITE_API_URL}${user.profilePicture}`
                            : "/profile_pictures/pfp.png"
                        }
                        alt="Profile"
                        className={`w-8 h-8 rounded-full object-cover border-2 border-violet-500 ${
                          imageLoading ? 'opacity-0' : 'opacity-100'
                        }`}
                        onError={(e) => {
                          e.target.src = "/profile_pictures/pfp.png";
                          setImageLoading(false);
                        }}
                        onLoad={() => setImageLoading(false)}
                      />
                    </div>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="p-2 bg-red-500/20 hover:bg-red-500/30 cursor-pointer rounded-md transition-colors flex items-center justify-center"
                    title="Cerrar Sesión"
                  >
                    <IoExitOutline className="w-6 h-6" />
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="px-4 py-2 bg-[#3D5AFE] hover:bg-[#5C6BC0] rounded-md transition-colors"
                >
                  Iniciar Sesión
                </Link>
              )}
            </div>
          </div>

          <div
            className={`${
              isMenuOpen ? "block" : "hidden"
            } md:hidden py-2 space-y-2`}
          >
            <Link
              to="/users"
              className="block px-4 py-2 hover:bg-[#5C6BC0] rounded-md transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Usuarios
            </Link>
            <Link
              to="/games"
              className="block px-4 py-2 hover:bg-[#5C6BC0] rounded-md transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Juegos
            </Link>
            {isAuth ? (
              <>
                <Link
                  to="/dashboard"
                  className="block px-4 py-2 hover:bg-[#5C6BC0] rounded-md transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="flex items-center space-x-3">
                    <span className="font-medium">{user?.username}</span>
                    <img
                      src={
                        user?.profilePicture
                          ? `${import.meta.env.VITE_API_URL}${user.profilePicture}`
                          : "/profile_pictures/pfp.png"
                      }
                      alt="Profile"
                      className="w-8 h-8 rounded-full object-cover border-2 border-violet-500"
                      onError={(e) => {
                        e.target.src = "/profile_pictures/pfp.png";
                      }}
                    />
                  </div>
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-[#5C6BC0] rounded-md transition-colors flex items-center space-x-2"
                >
                  <IoExitOutline className="w-6 h-6" />
                  <span>Cerrar Sesión</span>
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="block px-4 py-2 bg-[#3D5AFE] hover:bg-[#5C6BC0] rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Iniciar Sesión
              </Link>
            )}
          </div>
        </div>
      </nav>

      <ConfirmationModal
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={confirmLogout}
        title="¿Estás seguro que deseas cerrar sesión?"
        confirmText="Cerrar Sesión"
        cancelText="Cancelar"
      />
    </>
  );
};

export default Navbar;