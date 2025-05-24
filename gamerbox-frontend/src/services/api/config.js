// Configuración base de la API
export const API_URL = import.meta.env.VITE_API_URL;

// Función helper para manejar headers
export const getAuthHeaders = (token = localStorage.getItem('token')) => {
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
};

// Función helper para manejar respuestas
export const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Error en la petición');
  }
  return response.json();
};