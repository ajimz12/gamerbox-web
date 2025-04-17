import { createContext, useContext, useState, useEffect } from 'react';
import { isAuthenticated, logout } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isAuth, setIsAuth] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = () => {
            const auth = isAuthenticated();
            setIsAuth(auth);
            if (auth) {
                setUser(JSON.parse(localStorage.getItem('user')));
            }
            setLoading(false);
        };
        checkAuth();
    }, []);

    const login = (userData) => {
        localStorage.setItem('user', JSON.stringify(userData.user));
        localStorage.setItem('token', userData.token);
        setUser(userData.user);
        setIsAuth(true);
    };

    const handleLogout = () => {
        logout();
        setUser(null);
        setIsAuth(false);
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