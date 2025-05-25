import { API_URL, getAuthHeaders, handleResponse } from "./config";

export const createList = async (listData) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/api/lists`, {
    method: "POST",
    headers: getAuthHeaders(token),
    body: JSON.stringify(listData),
  });
  return handleResponse(response);
};

export const deleteList = async (listId) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/api/lists/${listId}`, {
    method: "DELETE",
    headers: getAuthHeaders(token),
  });
  return handleResponse(response);
};

export const getListDetails = async (listId) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/api/lists/${listId}`, {
    headers: getAuthHeaders(token),
  });
  return handleResponse(response);
};

export const updateList = async (listId, listData) => {
  const response = await fetch(`${API_URL}/api/lists/${listId}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(listData),
  });
  return handleResponse(response);
};

export const removeGameFromList = async (listId, gameId) => {
  const response = await fetch(
    `${API_URL}/api/lists/${listId}/games/${gameId}`,
    {
      method: "DELETE",
      headers: getAuthHeaders(),
    }
  );
  return handleResponse(response);
};

export const addGameToList = async (listId, gameId, gameData) => {
  const response = await fetch(
    `${API_URL}/api/lists/${listId}/games/${gameId}`,
    {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(gameData),
    }
  );
  return handleResponse(response);
};

export const getRecentLists = async () => {
  const response = await fetch(`${API_URL}/api/lists/recent`);
  return handleResponse(response);
};

export const getAllLists = async () => {
  const response = await fetch(`${API_URL}/api/lists`);
  return handleResponse(response);
};

export const getUserLists = async (username) => {
  const response = await fetch(`${API_URL}/api/users/${username}/lists`);
  return handleResponse(response);
};
