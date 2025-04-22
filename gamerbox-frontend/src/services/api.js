import axios from "axios";

const API_URL = "http://localhost:8000/api/";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptar solicitudes para añadir el JWT a los headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      if (config.data instanceof FormData) {
        delete config.headers["Content-Type"];
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const login = async (email, password) => {
  try {
    const response = await api.post("login", { email, password });
    console.log("Login response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Inicio de sesion fallido", error);
    throw error;
  }
};

export const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  return !!(token && user);
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export const register = async (userData) => {
  const response = await fetch(`${API_URL}register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    throw new Error("Registro fallido");
  }

  return response.json();
};

export const updateProfile = async ({ username, profilePicture }) => {
  const formData = new FormData();
  formData.append("username", username);
  if (profilePicture) {
    formData.append("profilePicture", profilePicture);
  }

  try {
    const response = await api.post("profile/update", formData);

    const currentUser = JSON.parse(localStorage.getItem("user"));
    const updatedUser = { ...currentUser, ...response.data.user };
    localStorage.setItem("user", JSON.stringify(updatedUser));

    return response.data.user;
  } catch (error) {
    console.error("Error al actualizar perfil", error);
    throw error;
  }
};

export const getUserProfile = async (userId) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/profile/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Error al obtener datos del usuario');
    }

    const data = await response.json();
    return data.user;
  } catch (error) {
    console.error("Error al obtener datos del usuario", error);
    throw error;
  }
};

export default api;
