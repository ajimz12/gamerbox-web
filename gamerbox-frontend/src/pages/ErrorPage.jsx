import { Link } from "react-router-dom";
import { IoGameController } from "react-icons/io5";

const ErrorPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md">
        <div className="flex justify-center mb-4">
          <IoGameController className="text-rose-400 text-7xl animate-bounce" />
        </div>
        <h1 className="text-6xl font-bold text-rose-400 mb-4">¡Oops!</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Lo sentimos, algo salió mal
        </h2>

        <p className="text-gray-500 mb-6">
          La página que buscas no existe o no está disponible en este momento
        </p>
        <Link
          to="/"
          className="inline-block bg-rose-400 text-white px-6 py-2 rounded-full hover:bg-rose-500 transition-colors"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;
