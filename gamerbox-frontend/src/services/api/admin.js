import { API_URL, getAuthHeaders, handleResponse } from "./config";

const ADMIN_API_URL = `${API_URL}/api/admin`;

// Fetch admin statistics
export const getAdminStats = async () => {
  const response = await fetch(`${ADMIN_API_URL}/stats`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};


// Ban a user
export const adminBanUser = async (userId) => {
  const response = await fetch(`${ADMIN_API_URL}/users/${userId}/ban`, {
    method: "POST",
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

// Unban a user
export const adminUnbanUser = async (userId) => {
  const response = await fetch(`${ADMIN_API_URL}/users/${userId}/unban`, {
    method: "POST",
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

// Promote a user to admin
export const adminPromoteUser = async (userId) => {
  const response = await fetch(`${ADMIN_API_URL}/users/${userId}/promote`, {
    method: "POST",
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

// Demote an admin to user
export const adminDemoteUser = async (userId) => {
  const response = await fetch(`${ADMIN_API_URL}/users/${userId}/demote`, {
    method: "POST",
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

// Delete a review
export const adminDeleteReview = async (reviewId) => {
  const response = await fetch(`${ADMIN_API_URL}/reviews/${reviewId}/delete`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

// Delete a comment
export const adminDeleteComment = async (commentId) => {
  const response = await fetch(`${ADMIN_API_URL}/comments/${commentId}/delete`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

// Delete a list
export const adminDeleteList = async (listId) => {
  const response = await fetch(`${ADMIN_API_URL}/lists/${listId}/delete`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};