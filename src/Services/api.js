// src/services/api.js
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const REQUEST_TIMEOUT_MS = 8000;

function getAuthToken() {
  return localStorage.getItem('authToken');
}

export async function fetchData(endpoint, options = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  const token = getAuthToken();

  try {
    const response = await fetch(`${API_URL}/${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
      ...options,
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error(`API timeout: ${API_URL}/${endpoint} did not respond`);
    }

    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
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
