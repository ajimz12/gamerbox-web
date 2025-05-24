import { API_URL, getAuthHeaders, handleResponse } from './config';

export const updateProfile = async (profileData) => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No authentication token found');

  const formData = new FormData();
  Object.entries(profileData).forEach(([key, value]) => {
    if (value) formData.append(key, value);
  });

  try {
    const response = await fetch(`${API_URL}/api/profile/update`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    const data = await handleResponse(response);
    const currentUser = JSON.parse(localStorage.getItem('user'));
    const updatedUser = { ...currentUser, ...data.user };
    localStorage.setItem('user', JSON.stringify(updatedUser));

    return data.user;
  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    throw error;
  }
};

export const getUserProfile = async (username) => {
  try {
    const response = await fetch(`${API_URL}/api/profile/${username}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    const data = await handleResponse(response);
    return data.user;
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    throw error;
  }
};