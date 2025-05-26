import { createContext, useContext, useState, useEffect } from 'react';
import { isAuthenticated, logout } from '../services/api/auth';
import { toast } from 'react-toastify';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isAuth, setIsAuth] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = () => {
            try {
                const userStr = localStorage.getItem('user');
                const token = localStorage.getItem('token');
                
                if (!userStr || !token) {
                    setIsAuth(false);
                    setUser(null);
                    setLoading(false);
                    return;
                }

                const userData = JSON.parse(userStr);
                if (userData.banned) {
                    handleLogout();
                    toast.error('Tu cuenta ha sido suspendida.');
                    return;
                }

                setIsAuth(true);
                setUser(userData);
                setLoading(false);
            } catch (error) {
                console.error('Error checking auth:', error);
                handleLogout();
                setLoading(false);
            }
        };
        checkAuth();
    }, []);

    const login = (userData) => {
        if (userData.user.banned) {
            toast.error('Tu cuenta ha sido suspendida.');
            handleLogout();
            return;
        }
        localStorage.setItem('user', JSON.stringify(userData.user));
        localStorage.setItem('token', userData.token);
        setUser(userData.user);
        setIsAuth(true);
    };

    const handleLogout = async () => {
        await logout();
        setUser(null);
        setIsAuth(false);
        localStorage.clear();
    };

    return (
        <AuthContext.Provider value={{ isAuth, user, login, logout: handleLogout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};