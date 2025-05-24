import { API_URL, getAuthHeaders, handleResponse } from './config';

export const login = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/api/login`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ email, password }),
    });

    const data = await handleResponse(response);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data;
  } catch (error) {
    console.error('Error en login:', error);
    throw error;
  }
};

export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  return !!(token && user);
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