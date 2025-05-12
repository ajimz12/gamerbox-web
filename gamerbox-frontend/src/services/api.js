const API_URL = "http://localhost:8000/api/";

export const login = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}login`, {
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
    const response = await fetch(`${API_URL}profile/update`, {
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
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/profile/${username}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
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
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users`, {
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

    const response = await fetch(`${API_URL}follow/${userId}`, {
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

    const response = await fetch(`${API_URL}reviews`, {
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
    const response = await fetch(`${API_URL}games/${gameId}/reviews`);
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
    const response = await fetch(`${API_URL}users/${username}/reviews`, {
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

    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/reviews/${reviewId}`, {
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

    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/reviews/${reviewId}`, {
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

    const response = await fetch(`${API_URL}reviews/${reviewId}/like`, {
      method: "POST",
      headers: {
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
