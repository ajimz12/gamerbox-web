// Configuración base de la API
export const API_URL = import.meta.env.VITE_API_URL;

export const getAuthHeaders = (token = localStorage.getItem('token')) => {
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
};

export const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Error en la solicitud');
  }
  return data;
};
