import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../services/api";
import { useAuth } from "../context/AuthContext";

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
  const { isAuth } = useAuth();

  useEffect(() => {
    if (isAuth) {
      navigate("/dashboard");
    }
  }, [isAuth, navigate]);

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
      setError("Las contraseñas no coinciden");
      setIsLoading(false);
      return;
    }

    try {
      await register(formData);
      navigate("/login");
    } catch (error) {
      setError(
        "Error al registrar el usuario. Por favor, inténtalo de nuevo: ",
        error
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#121212]">
      <div className="max-w-md w-full space-y-8 p-8 bg-[#1E1E1E] rounded-lg shadow border border-[#2C2C2C]">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-[#E0E0E0]">
            Crear Cuenta
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="username" className="sr-only">
                Nombre de Usuario
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-[#2C2C2C] placeholder-[#A0A0A0] text-[#E0E0E0] bg-[#1E1E1E] focus:outline-none focus:ring-[#3D5AFE] focus:border-[#3D5AFE] focus:z-10 sm:text-sm"
                placeholder="Nombre de Usuario"
                value={formData.username}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="email" className="sr-only">
                Correo Electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-[#2C2C2C] placeholder-[#A0A0A0] text-[#E0E0E0] bg-[#1E1E1E] focus:outline-none focus:ring-[#3D5AFE] focus:border-[#3D5AFE] focus:z-10 sm:text-sm"
                placeholder="Correo Electrónico"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-[#2C2C2C] placeholder-[#A0A0A0] text-[#E0E0E0] bg-[#1E1E1E] focus:outline-none focus:ring-[#3D5AFE] focus:border-[#3D5AFE] focus:z-10 sm:text-sm"
                placeholder="Contraseña"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="sr-only">
                Confirmar Contraseña
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-[#2C2C2C] placeholder-[#A0A0A0] text-[#E0E0E0] bg-[#1E1E1E] focus:outline-none focus:ring-[#3D5AFE] focus:border-[#3D5AFE] focus:z-10 sm:text-sm"
                placeholder="Confirmar Contraseña"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-[#E0E0E0] bg-[#3D5AFE] hover:bg-[#5C6BC0] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3D5AFE] disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <LoadingSpinner />
                </>
              ) : (
                "Registrarse"
              )}
            </button>
          </div>
          <div className="text-sm text-center">
            <span className="text-[#A0A0A0]">¿Ya tienes una cuenta? </span>
            <Link
              to="/login"
              className="font-medium text-[#3D5AFE] hover:text-[#5C6BC0]"
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
