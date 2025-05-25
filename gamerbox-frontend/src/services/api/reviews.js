import { API_URL, getAuthHeaders, handleResponse } from './config';

export const createReview = async (gameId, rating, text, playedBefore, playedAt) => {
  const response = await fetch(`${API_URL}/api/reviews`, {
    method: "POST",
    headers: {
      ...getAuthHeaders(),
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      gameId,
      rating,
      text,
      playedBefore,
      playedAt,
    }),
  });

  return handleResponse(response);
};

export const getGameReviews = async (gameId) => {
  const response = await fetch(`${API_URL}/api/games/${gameId}/reviews`);
  return handleResponse(response);
};

export const getUserReviews = async (username) => {
  const response = await fetch(`${API_URL}/api/users/${username}/reviews`, {
    headers: {
      "Content-Type": "application/json"
    }
  });

  return handleResponse(response);
};

export const deleteReview = async (reviewId) => {
  const response = await fetch(`${API_URL}/api/reviews/${reviewId}`, {
    method: "DELETE",
    headers: getAuthHeaders()
  });

  return handleResponse(response);
};

export const updateReview = async (reviewId, { rating, text, playedBefore, playedAt }) => {
  const response = await fetch(`${API_URL}/api/reviews/${reviewId}`, {
    method: "PUT",
    headers: {
      ...getAuthHeaders(),
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      rating,
      text,
      playedBefore,
      playedAt: playedAt || null,
    }),
  });

  return handleResponse(response);
};

export const likeReview = async (reviewId) => {
  const response = await fetch(`${API_URL}/api/reviews/${reviewId}/like`, {
    method: "POST",
    headers: {
      ...getAuthHeaders(),
      "Content-Type": "application/json"
    }
  });

  return handleResponse(response);
};

export const getReviewById = async (reviewId) => {
  const response = await fetch(`${API_URL}/api/reviews/${reviewId}`, {
    headers: {
      "Content-Type": "application/json"
    }
  });

  return handleResponse(response);
};

export const getAllReviews = async (orderBy = "date") => {
  const response = await fetch(`${API_URL}/api/reviews?orderBy=${orderBy}`, {
    headers: {
      "Content-Type": "application/json"
    }
  });

  return handleResponse(response);
};

export const getFollowingReviews = async () => {
  const response = await fetch(`${API_URL}/api/reviews/following`, {
    headers: getAuthHeaders()
  });
  return handleResponse(response);
};