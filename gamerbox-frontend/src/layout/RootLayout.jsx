import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { useState } from "react";
import { IoExitOutline } from "react-icons/io5";
import { IoMenu, IoClose } from "react-icons/io5";
import ConfirmationModal from "../components/ConfirmationModal";

const RootLayout = () => {
  const { isAuth, user, logout } = useAuth();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
    <div className="min-h-screen flex flex-col">
      <nav className="bg-violet-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/" className="flex items-center space-x-2 cursor-pointer">
              <span className="font-bold text-xl">GamerBox</span>
            </Link>

            {/* Botón de menú hamburguesa */}
            <button
              onClick={toggleMenu}
              className="md:hidden p-2 rounded-md hover:bg-violet-700 transition-colors"
            >
              {isMenuOpen ? (
                <IoClose className="h-6 w-6" />
              ) : (
                <IoMenu className="h-6 w-6" />
              )}
            </button>

            {/* Menú de navegación para pantallas medianas y grandes */}
            <div className="hidden md:flex items-center space-x-4">
              {isAuth ? (
                <>
                  <Link
                    to="/users"
                    className="px-4 py-2 hover:bg-violet-700 rounded-md transition-colors"
                  >
                    Usuarios
                  </Link>
                  <Link
                    to="/dashboard"
                    className="flex items-center space-x-3 bg-violet-700 hover:bg-violet-800 px-4 py-2 rounded-md transition-colors"
                  >
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
                  className="px-4 py-2 hover:bg-violet-700 rounded-md transition-colors"
                >
                  Iniciar Sesión
                </Link>
              )}
            </div>
          </div>

          {/* Menú móvil */}
          <div
            className={`${
              isMenuOpen ? "block" : "hidden"
            } md:hidden py-2 space-y-2`}
          >
            {isAuth ? (
              <>
                <Link
                  to="/users"
                  className="block px-4 py-2 hover:bg-violet-700 rounded-md transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Usuarios
                </Link>
                <Link
                  to="/dashboard"
                  className="block px-4 py-2 hover:bg-violet-700 rounded-md transition-colors"
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
                  className="w-full text-left px-4 py-2 hover:bg-violet-700 rounded-md transition-colors flex items-center space-x-2"
                >
                  <IoExitOutline className="w-6 h-6" />
                  <span>Cerrar Sesión</span>
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="block px-4 py-2 hover:bg-violet-700 rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Iniciar Sesión
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Logout Modal */}
      <ConfirmationModal
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={confirmLogout}
        title="¿Estás seguro que deseas cerrar sesión?"
        confirmText="Cerrar Sesión"
        cancelText="Cancelar"
      />

      {/* Main */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm">
                © 2025 GamerBox. Todos los derechos reservados.
              </p>
            </div>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-gray-300 cursor-pointer">
                Términos
              </a>
              <a href="#" className="hover:text-gray-300 cursor-pointer">
                Privacidad
              </a>
              <a href="#" className="hover:text-gray-300 cursor-pointer">
                Contacto
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Move the animation style to global CSS or a styles file
const style = document.createElement("style");
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

export default RootLayout;
