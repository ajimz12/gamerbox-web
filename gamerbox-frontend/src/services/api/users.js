import { API_URL, getAuthHeaders, handleResponse } from "./config";

export const getAllUsers = async () => {
  try {
    const response = await fetch(`${API_URL}/api/users`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener usuarios");
    }

    const data = await response.json();
    return data.users;
  } catch (error) {
    console.error("Error al obtener usuarios", error);
    throw error;
  }
};

export const followUser = async (userId) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/api/follow/${userId}`, {
    method: "POST",
    headers: getAuthHeaders(token),
  });
  return handleResponse(response);
};

export const getUserGames = async (username) => {
  try {
    const response = await fetch(`${API_URL}/api/users/${username}/games`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener los juegos del usuario");
    }

    const data = await response.json();
    return data.games;
  } catch (error) {
    console.error("Error al obtener los juegos del usuario", error);
    throw error;
  }
};


