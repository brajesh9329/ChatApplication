
export const API_BASE_URL = "http://192.168.1.40:8080";

// JWT token stored after login
let authToken = null;

// Save JWT token
export function setAuthToken(token) {
  authToken = token;
}

// Get JWT token for WebSocket authentication
export function getAuthToken() {
  console.log("JWT TOKEN:", authToken);
  return authToken;
}

// Clear JWT token on logout
export function clearAuthToken() {
  authToken = null;
}

// API request with JWT authentication
export async function apiRequest(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",

    ...(authToken
      ? { Authorization: `Bearer ${authToken}` }
      : {}),

    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const text = await response.text();

  let data = {};

  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { message: text };
  }

  if (!response.ok) {
    throw new Error(
      data.message ||
        data.error ||
        `Request failed (${response.status})`
    );
  }

  return data;
}
