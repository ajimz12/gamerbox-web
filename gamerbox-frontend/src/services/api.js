import axios from 'axios';

const API_URL = 'http://localhost:8000/api/';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptar solicitudes para añadir el JWT a los headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const login = async (email, password) => {
  try {
    const response = await api.post('login', { email, password });
    localStorage.setItem('token', response.data.token);  // Guardar el token en localStorage
    return response.data.token;
  } catch (error) {
    console.error('Login failed', error);
    throw error;
  }
};

export const getMe = async () => {
  try {
    const response = await api.get('me');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch user data', error);
    throw error;
  }
};

export default api;
