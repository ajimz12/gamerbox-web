import { API_URL, getAuthHeaders, handleResponse } from './config';

export const getReviewComments = async (reviewId) => {
  const response = await fetch(`${API_URL}/api/reviews/${reviewId}/comments`);
  return handleResponse(response);
};

export const createComment = async (reviewId, text) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/api/reviews/${reviewId}/comments`, {
    method: 'POST',
    headers: getAuthHeaders(token),
    body: JSON.stringify({ text }),
  });
  return handleResponse(response);
};

export const deleteComment = async (commentId) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/api/comments/${commentId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(token),
  });
  return handleResponse(response);
};