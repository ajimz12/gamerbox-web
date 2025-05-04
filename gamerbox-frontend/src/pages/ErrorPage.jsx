import { Link } from "react-router-dom";

const ErrorPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#121212] px-4">
      <div className="flex flex-col items-center text-center bg-[#1E1E1E] p-10 rounded-2xl shadow-2xl border border-[#2C2C2C] max-w-lg w-full space-y-6">
        <img
          src="/img/errorpage.png"
          alt="Error 404"
          className="w-100 h-72 object-contain"
        />
        <div>
          <h1 className="text-5xl font-bold text-[#3D5AFE] mb-8">¡Oops!</h1>
          <h2 className="text-xl text-[#A0A0A0]">
            La página que buscas no existe o no está disponible en este momento.
          </h2>
        </div>

        <Link
          to="/"
          className="bg-[#3D5AFE] text-[#E0E0E0] px-6 py-2 rounded-full hover:bg-[#5C6BC0] transition-colors font-medium"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;
