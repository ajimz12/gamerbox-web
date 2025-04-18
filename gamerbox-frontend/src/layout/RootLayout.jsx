import { Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const RootLayout = () => {
    const { isAuth, user, logout } = useAuth();

    return (
        <div className="min-h-screen flex flex-col">
            {/* Navigation */}
            <nav className="bg-violet-600 text-white shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <Link to="/" className="flex items-center space-x-2">
                            <span className="font-bold text-xl">GamerBox</span>
                        </Link>
                        
                        <div className="flex items-center space-x-4">
                            {isAuth ? (
                                <>
                                    <Link to="/dashboard" className="hover:text-gray-200">
                                        Dashboard
                                    </Link>
                                    <button 
                                        onClick={logout}
                                        className="hover:text-gray-200"
                                    >
                                        Cerrar Sesión
                                    </button>
                                </>
                            ) : (
                                <Link to="/login" className="hover:text-gray-200">
                                    Iniciar Sesión
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="flex-grow">
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="bg-gray-800 text-white py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-sm">© 2024 GamerBox. Todos los derechos reservados.</p>
                        </div>
                        <div className="flex space-x-4">
                            <a href="#" className="hover:text-gray-300">Términos</a>
                            <a href="#" className="hover:text-gray-300">Privacidad</a>
                            <a href="#" className="hover:text-gray-300">Contacto</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default RootLayout;