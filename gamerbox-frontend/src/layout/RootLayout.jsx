import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { IoExitOutline } from "react-icons/io5";

const RootLayout = () => {
    const { isAuth, user, logout } = useAuth();
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        setShowLogoutConfirm(true);
    };

    const confirmLogout = () => {
        logout();
        setShowLogoutConfirm(false);
        navigate('/login');
    };

    return (
        <div className="min-h-screen flex flex-col">
            <nav className="bg-violet-600 text-white shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <Link to="/" className="flex items-center space-x-2 cursor-pointer">
                            <span className="font-bold text-xl">GamerBox</span>
                        </Link>
                        
                        <div className="flex items-center space-x-4">
                            {isAuth ? (
                                <>
                                    <Link 
                                        to="/dashboard" 
                                        className="flex items-center space-x-3 bg-violet-700 hover:bg-violet-800 px-4 py-2 rounded-md transition-colors"
                                    >
                                        <span className="font-medium">{user?.username}</span>
                                        <img 
                                            src={user?.profilePicture ? `${import.meta.env.VITE_API_URL}${user.profilePicture}` : '/profile_pictures/pfp.png'}
                                            alt="Profile"
                                            className="w-8 h-8 rounded-full object-cover border-2 border-violet-500"
                                            onError={(e) => {
                                                e.target.src = '/profile_pictures/pfp.png';
                                            }}
                                        />
                                    </Link>
                                    <button 
                                        onClick={handleLogout}
                                        className="p-2 bg-red-500/20 hover:bg-red-500/30 cursor-pointer rounded-md transition-colors flex items-center justify-center"
                                        title="Cerrar Sesión"
                                    >
                                        <IoExitOutline className="w-6 h-6" />
                                    </button>
                                </>
                            ) : (
                                <Link 
                                    to="/login" 
                                    className="px-4 py-2 hover:bg-violet-700 rounded-md transition-colors"
                                >
                                    Iniciar Sesión
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Logout  */}
            {showLogoutConfirm && (
                <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-sm mx-4 shadow-xl animate-slide-in"
                        style={{
                            animation: 'slideIn 0.3s ease-out'
                        }}>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                            ¿Estás seguro que deseas cerrar sesión?
                        </h3>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={() => setShowLogoutConfirm(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors cursor-pointer"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={confirmLogout}
                                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors cursor-pointer"
                            >
                                Cerrar Sesión
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Main */}
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
                            <a href="#" className="hover:text-gray-300 cursor-pointer">Términos</a>
                            <a href="#" className="hover:text-gray-300 cursor-pointer">Privacidad</a>
                            <a href="#" className="hover:text-gray-300 cursor-pointer">Contacto</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

export default RootLayout;