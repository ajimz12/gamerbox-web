import { API_URL, getAuthHeaders, handleResponse } from './config';

export const login = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/api/login`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ email, password }),
    });

    const data = await handleResponse(response);
    
    if (!response.ok) {
      throw new Error(data.message || 'Error desconocido');
    }
    
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data;
  } catch (error) {
    console.error('Error en login:', error);
    throw error;
  }
};

export const isAuthenticated = () => {
  try {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    if (!token || !userStr) return false;
    
    const user = JSON.parse(userStr);
    return !user.isBanned;
  } catch (error) {
    console.error('Error comprobando autenticacion:', error);
    return false;
  }
};

export const logout = async () => {
  try {
    localStorage.clear();
    await new Promise((resolve) => setTimeout(resolve, 200));
    window.location.href = '/';
    return true;
  } catch (error) {
    console.error('Error en logout:', error);
    throw error;
  }
};

export const register = async (userData) => {
  const response = await fetch(`${API_URL}/api/register`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(userData),
  });
  return handleResponse(response);
};