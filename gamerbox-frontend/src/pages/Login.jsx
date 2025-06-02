import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../services/api/auth";
import { useAuth } from "../context/AuthContext";
import { FiLock, FiLogIn, FiMail } from "react-icons/fi";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login: authLogin, isAuth, user } = useAuth();

  useEffect(() => {
    if (isAuth && user) {
      navigate(`/user/${user.username}`);
    }
  }, [isAuth, navigate, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const data = await login(email, password);
      if (data && data.token) {
        authLogin(data);
        navigate(`/user/${data.user.username}`);
      } else {
        setError('Error en la respuesta del servidor');
      }
    } catch (error) {
      console.error('Error de login:', error);
      setError(
        error.message === 'Tu cuenta ha sido suspendida'
          ? 'Tu cuenta ha sido suspendida'
          : error.message || 'Correo electrónico o contraseña incorrectos. Por favor, inténtalo de nuevo.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center font-chakra justify-center bg-gradient-to-br from-[#121212] to-[#1A1A1A] p-4">
      <div className="max-w-md w-full space-y-10 p-10 bg-[#1E1E1E] rounded-xl shadow-2xl border border-[#2C2C2C]">
        <div className="text-center">
          {/* LOGO */}
          <img src="/img/logo.png" alt="GamerBox Logo" className="mx-auto h-24 w-auto mb-12" />
          <h1 className="text-2xl font-bold mb-5 text-[#E0E0E0] tracking-tight">
            Bienvenido de Nuevo
          </h1>
          <p className="mt-2 text-lg text-[#A0A0A0]">
            Inicia sesión para continuar en GamerBox
          </p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiMail className="h-5 w-5 text-[#A0A0A0] z-10" />
              </span>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-lg relative block w-full pl-10 pr-3 py-3 border border-[#2C2C2C] placeholder-[#A0A0A0] text-[#E0E0E0] bg-[#252525] focus:outline-none focus:ring-2 focus:ring-[#3D5AFE] focus:border-[#3D5AFE] sm:text-sm transition-all duration-200"
                placeholder="Correo Electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiLock className="h-5 w-5 text-[#A0A0A0] z-10" />
              </span>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-lg relative block w-full pl-10 pr-3 py-3 border border-[#2C2C2C] placeholder-[#A0A0A0] text-[#E0E0E0] bg-[#252525] focus:outline-none focus:ring-2 focus:ring-[#3D5AFE] focus:border-[#3D5AFE] sm:text-sm transition-all duration-200"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div
              className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded-lg relative"
              role="alert"
            >
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex items-center justify-center cursor-pointer py-3 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-[#3D5AFE] hover:bg-[#536DFE] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#1E1E1E] focus:ring-[#3D5AFE] disabled:opacity-60 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span className="ml-2">Iniciando...</span>
                </>
              ) : (
                <>
                  <FiLogIn className="mr-2 h-5 w-5" />
                  Iniciar Sesión
                </>
              )}
            </button>
          </div>
        </form>

        <div className="text-center text-md text-[#A0A0A0]">
          ¿Aún no tienes una cuenta?{" "}
          <Link
            to="/register"
            className="font-semibold text-[#3D5AFE] hover:text-[#536DFE] hover:underline"
          >
            Regístrate aquí
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
