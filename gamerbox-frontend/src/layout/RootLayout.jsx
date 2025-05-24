import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";
import { FaArrowUp } from "react-icons/fa"; 

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
      <header className="sticky top-0 z-50">
        <Navbar />
      </header>

      <main className="flex-grow">
        <Outlet />
      </main>

      <footer className="bg-[#1E1E1E] font-chakra text-lg text-[#E0E0E0] py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <p>
                © 2025 GamerBox. Todos los derechos reservados.
              </p>
            </div>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-[#5C6BC0] cursor-pointer">
                Términos
              </a>
              <a href="#" className="hover:text-[#5C6BC0] cursor-pointer">
                Privacidad
              </a>
            </div>
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
