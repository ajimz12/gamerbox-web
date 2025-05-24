import { Link } from "react-router-dom";
import { GiEyepatch } from "react-icons/gi";

const ErrorPage = () => {
  return (
    <div className="min-h-screen flex font-chakra items-center justify-center bg-[#121212] px-4">
      <div className="flex flex-col items-center text-center bg-[#1E1E1E] p-10 rounded-2xl shadow-2xl border border-[#2C2C2C] max-w-lg w-full space-y-6">
        <div className="flex flex-col items-center">
          <GiEyepatch className="text-5xl text-[#3D5AFE] mb-4" />
          <h1 className="text-4xl font-bold text-[#3D5AFE]  italic mb-8">
            Snake? Snaaaake!
          </h1>
          <h1 className="text-xl text-[#A0A0A0]">
            La página que buscas no existe o no está disponible en este momento.
          </h1>
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
