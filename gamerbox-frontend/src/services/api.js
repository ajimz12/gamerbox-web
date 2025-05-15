const API_URL=import.meta.env.VITE_API_URL;

export const login = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error("Inicio de sesión fallido");
    }

    const data = await response.json();
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    return data;
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

export const logout = async () => {
  try {
    localStorage.clear();

    await new Promise((resolve) => setTimeout(resolve, 200));

    window.location.href = "/";

    return true;
  } catch (error) {
    console.error("Error durante el logout:", error);
    throw error;
  }
};

export const register = async (userData) => {
  const response = await fetch(`${API_URL}/api/register`, {
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

export const updateProfile = async ({
  username,
  profilePicture,
  location,
  instagram_profile,
  twitter_profile,
  description,
}) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No authentication token found");
  }

  const formData = new FormData();
  formData.append("username", username);
  if (profilePicture) {
    formData.append("profilePicture", profilePicture);
  }
  if (location) {
    formData.append("location", location);
  }
  if (instagram_profile) {
    formData.append("instagram_profile", instagram_profile);
  }
  if (twitter_profile) {
    formData.append("twitter_profile", twitter_profile);
  }
  if (description) {
    formData.append("description", description);
  }

  try {
    const response = await fetch(`${API_URL}/api/profile/update`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Error al actualizar perfil");
    }

    const data = await response.json();
    const currentUser = JSON.parse(localStorage.getItem("user"));
    const updatedUser = { ...currentUser, ...data.user };
    localStorage.setItem("user", JSON.stringify(updatedUser));

    return data.user;
  } catch (error) {
    console.error("Error al actualizar perfil", error);
    throw error;
  }
};

export const getUserProfile = async (username) => {
  try {
    const token = localStorage.getItem("token");
    const headers = {
      "Content-Type": "application/json",
    };

    // Añadir el token de autorización si existe
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(
      `${API_URL}/api/profile/${username}`,
      {
        method: "GET",
        headers: headers,
      }
    );

    if (!response.ok) {
      throw new Error("Error al obtener datos del usuario");
    }

    const data = await response.json();
    return data.user;
  } catch (error) {
    console.error("Error al obtener datos del usuario", error);
    throw error;
  }
};

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
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_URL}/api/follow/${userId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error || "Error al seguir/dejar de seguir al usuario"
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en la acción de seguir", error);
    throw error;
  }
};

export const createReview = async (gameId, rating, text, playedBefore, playedAt) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_URL}/api/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ 
        gameId, 
        rating, 
        text,
        playedBefore,
        playedAt 
      }),
    });

    if (!response.ok) {
      throw new Error("Error al crear la reseña");
    }

    return response.json();
  } catch (error) {
    console.error("Error al crear la reseña", error);
    throw error;
  }
};

export const getGameReviews = async (gameId) => {
  try {
    const response = await fetch(`${API_URL}/api/games/${gameId}/reviews`);
    if (!response.ok) {
      throw new Error("Error al obtener las reseñas");
    }
    return response.json();
  } catch (error) {
    console.error("Error al obtener las reseñas", error);
    throw error;
  }
};

export const getUserReviews = async (username) => {
  try {
    const response = await fetch(`${API_URL}/api/users/${username}/reviews`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener las reseñas del usuario");
    }

    return await response.json();
  } catch (error) {
    console.error("Error al obtener las reseñas del usuario", error);
    throw error;
  }
};

export const deleteReview = async (reviewId) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No se encontró el token de autenticación");
    }

    const response = await fetch(`${API_URL}/api/reviews/${reviewId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Error al eliminar la reseña');
    }

    return true;
  } catch (error) {
    console.error("Error al eliminar la reseña", error);
    throw error;
  }
};

export const updateReview = async (reviewId, { rating, text, playedBefore, playedAt }) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No se encontró el token de autenticación");
    }

    const response = await fetch(`${API_URL}/api/reviews/${reviewId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        rating,
        text,
        playedBefore,
        playedAt: playedAt || null,
      }),
    });

    if (!response.ok) {
      throw new Error("Error al actualizar la reseña");
    }

    return await response.json();
  } catch (error) {
    console.error("Error al actualizar la reseña", error);
    throw error;
  }
};

export const likeReview = async (reviewId) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No se encontró el token de autenticación");
    }

    const response = await fetch(`${API_URL}/api/reviews/${reviewId}/like`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Error al dar like a la reseña");
    }

    return await response.json();
  } catch (error) {
    console.error("Error al dar like a la reseña", error);
    throw error;
  }
};

export const getReviewById = async (reviewId) => {
  try {
    const response = await fetch(`${API_URL}/api/reviews/${reviewId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener la reseña");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al obtener la reseña", error);
    throw error;
  }
};

export const getReviewComments = async (reviewId) => {
  try {
    const response = await fetch(`${API_URL}/api/reviews/${reviewId}/comments`);
    if (!response.ok) {
      throw new Error("Error al obtener los comentarios");
    }
    return response.json();
  } catch (error) {
    console.error("Error al obtener los comentarios", error);
    throw error;
  }
};

export const createComment = async (reviewId, text) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_URL}/api/reviews/${reviewId}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      throw new Error("Error al crear el comentario");
    }

    return response.json();
  } catch (error) {
    console.error("Error al crear el comentario", error);
    throw error;
  }
};

export const deleteComment = async (commentId) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_URL}/api/comments/${commentId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Error al eliminar el comentario");
    }

    return true;
  } catch (error) {
    console.error("Error al eliminar el comentario", error);
    throw error;
  }
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

export const checkGameFavorite = async (gameId) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_URL}/api/games/${gameId}/favorite`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error("Error al verificar favorito");
    }

    return response.json();
  } catch (error) {
    console.error("Error al verificar favorito", error);
    throw error;
  }
};

export const toggleGameFavorite = async (gameId) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_URL}/api/games/${gameId}/favorite`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error("Error al actualizar favorito");
    }

    return response.json();
  } catch (error) {
    console.error("Error al actualizar favorito", error);
    throw error;
  }
};

export const getAllReviews = async (orderBy = 'date') => {
  const response = await fetch(`${API_URL}/api/reviews?orderBy=${orderBy}`, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
  if (!response.ok) throw new Error('Error al obtener las reseñas');
  return response.json();
};

const api = {
  login,
  isAuthenticated,
  logout,
  register,
  updateProfile,
  getUserProfile,
  getAllUsers,
};

export default api;
