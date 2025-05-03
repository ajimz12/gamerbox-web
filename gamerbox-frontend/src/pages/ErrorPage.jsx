import { Link } from "react-router-dom";
import { IoGameController } from "react-icons/io5";

const ErrorPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#121212]">
      <div className="text-center bg-[#1E1E1E] p-8 rounded-lg shadow-lg max-w-md border border-[#2C2C2C]">
        <div className="flex justify-center mb-4">
          <IoGameController className="text-[#3D5AFE] text-7xl animate-bounce" />
        </div>
        <h1 className="text-6xl font-bold text-[#3D5AFE] mb-4">¡Oops!</h1>
        <h2 className="text-2xl font-semibold text-[#E0E0E0] mb-4">
          Parece que la princesa está en otro castillo
        </h2>

        <p className="text-[#A0A0A0] mb-6">
          La página que buscas no existe o no está disponible en este momento
        </p>
        <Link
          to="/"
          className="inline-block bg-[#3D5AFE] text-[#E0E0E0] px-6 py-2 rounded-full hover:bg-[#5C6BC0] transition-colors"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;
