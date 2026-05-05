// src/services/api.js
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export async function fetchData(endpoint, options = {}) {
  const response = await fetch(`${API_URL}/${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
}

export const api = {
  get: (endpoint) => fetchData(endpoint),
  post: (endpoint, data) => fetchData(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  put: (endpoint, data) => fetchData(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (endpoint) => fetchData(endpoint, {
    method: 'DELETE',
  }),
};
