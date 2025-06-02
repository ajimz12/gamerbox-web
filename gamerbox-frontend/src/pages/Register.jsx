import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../services/api/auth";
import { useAuth } from "../context/AuthContext";
import { FiUser, FiMail, FiLock, FiLogIn } from 'react-icons/fi'; 
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    username: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { isAuth, user } = useAuth();

  useEffect(() => {
    if (isAuth && user) {
      navigate(`/user/${user.username}`);
    }
  }, [isAuth, navigate, user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden.");
      setIsLoading(false);
      return;
    }

    try {
      await register(formData);
      
      toast.success("¡Cuenta creada con éxito!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
        onClose: () => {
          navigate("/login?registered=true");
        }
      });
      
    } catch (error) {
      console.error('Error de registro:', error);
      if (error.response?.data) {
        const errorData = error.response.data;
        if (errorData.errors && Array.isArray(errorData.errors)) {
          setError(errorData.errors[0]);
        } else if (errorData.message) {
          if (errorData.message.includes('email')) {
            setError("Este correo electrónico ya está registrado.");
          } else {
            setError(errorData.message);
          }
        } else {
          setError("Error al registrar el usuario. Por favor, inténtalo de nuevo.");
        }
      } else {
        setError("Error al registrar el usuario. Por favor, inténtalo de nuevo.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex font-chakra items-center justify-center bg-gradient-to-br from-[#121212] to-[#1A1A1A] p-4">
      <div className="max-w-md w-full space-y-8 p-10 bg-[#1E1E1E] rounded-xl shadow-2xl border border-[#2C2C2C]">
        <div className="text-center">
          {/* LOGO */}
          <img src="/img/logo.png" alt="GamerBox Logo" className="mx-auto h-24 w-auto mb-12" />
          <h1 className="text-2xl font-bold text-[#E0E0E0] tracking-tight">
            Crea tu Cuenta
          </h1>
          <p className="mt-2 text-md text-[#A0A0A0]">
            Crea tu cuenta para empezar a explorar.
          </p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUser className="h-5 w-5 text-[#A0A0A0] z-10" />
              </span>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                className="appearance-none rounded-lg relative block w-full pl-10 pr-3 py-3 border border-[#2C2C2C] placeholder-[#A0A0A0] text-[#E0E0E0] bg-[#252525] focus:outline-none focus:ring-2 focus:ring-[#3D5AFE] focus:border-[#3D5AFE] sm:text-sm transition-all duration-200"
                placeholder="Nombre de Usuario"
                value={formData.username}
                onChange={handleChange}
              />
            </div>
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
                value={formData.email}
                onChange={handleChange}
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
                autoComplete="new-password"
                required
                className="appearance-none rounded-lg relative block w-full pl-10 pr-3 py-3 border border-[#2C2C2C] placeholder-[#A0A0A0] text-[#E0E0E0] bg-[#252525] focus:outline-none focus:ring-2 focus:ring-[#3D5AFE] focus:border-[#3D5AFE] sm:text-sm transition-all duration-200"
                placeholder="Contraseña"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-[#A0A0A0] z-10" />
              </span>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none rounded-lg relative block w-full pl-10 pr-3 py-3 border border-[#2C2C2C] placeholder-[#A0A0A0] text-[#E0E0E0] bg-[#252525] focus:outline-none focus:ring-2 focus:ring-[#3D5AFE] focus:border-[#3D5AFE] sm:text-sm transition-all duration-200"
                placeholder="Confirmar Contraseña"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded-lg relative" role="alert">
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{error}</span>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full cursor-pointer flex items-center justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-[#3D5AFE] hover:bg-[#536DFE] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#1E1E1E] focus:ring-[#3D5AFE] disabled:opacity-60 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="ml-2">Registrando...</span>
                </>
              ) : (
                <>
                  <FiLogIn className="mr-2 h-5 w-5" />
                  Crear Cuenta
                </>
              )}
            </button>
          </div>
          <div className="text-center text-md text-[#A0A0A0]">
            ¿Ya tienes una cuenta?{' '}
            <Link
              to="/login"
              className="font-semibold text-[#3D5AFE] hover:text-[#536DFE] hover:underline"
            >
              Inicia Sesión
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
