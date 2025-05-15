import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
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
        setError('');
        setIsLoading(true);
        
        try {
            const data = await login(email, password);
            authLogin(data);
            navigate(`/user/${data.user.username}`);
        } catch (error) {
            setError('El correo o la contraseña son incorrectos: ', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#121212]">
            <div className="max-w-md w-full space-y-8 p-8 bg-[#1E1E1E] rounded-lg shadow border border-[#2C2C2C]">
                <div>
                    <h2 className="text-center text-3xl font-extrabold text-[#E0E0E0]">
                        Inicio de Sesión
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm space-y-4">
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
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
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
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-[#E0E0E0] bg-[#3D5AFE] hover:bg-[#5C6BC0] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3D5AFE] disabled:opacity-50"
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-[#E0E0E0]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                </>
                            ) : (
                                'Iniciar Sesión'
                            )}
                        </button>
                    </div>
                </form>
                
                <div className="text-center text-sm text-[#A0A0A0]">
                    ¿No tienes cuenta?{' '}
                    <Link to="/register" className="font-medium text-[#3D5AFE] hover:text-[#5C6BC0]">
                        Regístrate
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
