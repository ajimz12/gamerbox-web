import { API_URL, getAuthHeaders, handleResponse } from "./config";

export const checkGameFavorite = async (gameId) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/api/games/${gameId}/favorite`, {
    headers: getAuthHeaders(token),
  });
  return handleResponse(response);
};

export const toggleGameFavorite = async (gameId) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/api/games/${gameId}/favorite`, {
    method: "POST",
    headers: getAuthHeaders(token),
  });
  return handleResponse(response);
};

export const getFavoriteGames = async (username) => {
  try {
    const response = await fetch(`${API_URL}/api/users/${username}/favorites`);
    if (!response.ok) {
      throw new Error("Error al cargar los juegos favoritos");
    }
    const data = await response.json();
    return data.games;
  } catch (error) {
    console.error("Error al cargar los juegos favoritos:", error);
    throw error;
  }
};

export const getSuperFavoriteGames = async (username) => {
  try {
    const response = await fetch(
      `${API_URL}/api/users/${username}/superfavorites`
    );
    const data = await response.json();
    return data.games || [];
  } catch (error) {
    console.error("Error al cargar juegos superfavoritos:", error);
    throw error;
  }
};

export const addSuperFavoriteGame = async (gameId) => {
  try {
    const response = await fetch(
      `${API_URL}/api/games/${gameId}/superfavorite`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    const data = await response.json();
    if (!response.ok) {
      throw new Error(
        data.error || "Error al añadir el juego a superfavoritos"
      );
    }
    return data;
  } catch (error) {
    throw error;
  }
};

export const removeSuperFavoriteGame = async (gameId) => {
  try {
    const response = await fetch(
      `${API_URL}/api/games/${gameId}/superfavorite`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Error al eliminar el juego de superfavoritos");
    }
    return response.json();
  } catch (error) {
    throw error;
  }
};
