import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const RootLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#121212]">
      <Navbar />

      <main className="flex-grow">
        <Outlet />
      </main>

      <footer className="bg-[#1E1E1E] text-[#E0E0E0] py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm">
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
    </div>
  );
};

export default RootLayout;
