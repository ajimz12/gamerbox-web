import { Link, Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";
import { FaArrowUp, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import ScrollToTop from "../components/ScrollToTop";

const RootLayout = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#121212]">
      <ScrollToTop />
      <header className="sticky top-0 z-50">
        <Navbar />
      </header>

      <main className="flex-grow">
        <Outlet />
      </main>

      <footer className="bg-[#1E1E1E] font-chakra text-[#E0E0E0] py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 text-center md:text-left">
            <div className="flex flex-col items-center md:items-start">
              <h2 className="text-xl font-bold text-white mb-4">GamerBox</h2>
              <p className="text-sm text-gray-400 max-w-xs">
                Tu portal definitivo de videojuegos. Conecta con miles de gamers.
              </p>
            </div>

            <div className="flex flex-col items-center md:items-start">
              <h3 className="text-lg font-semibold text-white mb-4">
                Navegación
              </h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link to="/games" className="hover:text-[#5C6BC0]">
                    Juegos
                  </Link>
                </li>
                <li>
                  <Link to="/users" className="hover:text-[#5C6BC0]">
                    Miembros
                  </Link>
                </li>
                <li>
                  <Link to="/reviews" className="hover:text-[#5C6BC0]">
                    Reseñas
                  </Link>
                </li>
                <li>
                  <Link to="/lists" className="hover:text-[#5C6BC0]">
                    Listas
                  </Link>
                </li>
              </ul>
            </div>

            <div className="flex flex-col items-center md:items-start">
              <h3 className="text-lg font-semibold text-white mb-4">
                Síguenos
              </h3>
              <div className="flex space-x-6">
                <a
                  href="#"
                  className="hover:text-[#5C6BC0] text-xl"
                  aria-label="Twitter"
                >
                  <FaTwitter />
                </a>
                <a
                  href="#"
                  className="hover:text-[#5C6BC0] text-xl"
                  aria-label="Instagram"
                >
                  <FaInstagram />
                </a>
                <a
                  href="#"
                  className="hover:text-[#5C6BC0] text-xl"
                  aria-label="YouTube"
                >
                  <FaYoutube />
                </a>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-12 border-t border-gray-700 pt-6 text-sm text-center text-gray-500">
            © 2025 GamerBox. Todos los derechos reservados.
          </div>
        </div>
      </footer>

      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-5 right-5 bg-[#5C6BC0] text-white p-3 cursor-pointer rounded-full shadow-lg hover:bg-[#3D5AFE] transition-colors duration-300 z-50"
          aria-label="Go to top"
        >
          <FaArrowUp size={20} />
        </button>
      )}
    </div>
  );
};

export default RootLayout;
