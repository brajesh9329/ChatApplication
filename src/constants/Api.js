export const API_BASE_URL = "http://192.168.1.9:8080";

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

// API request with JSON and FormData support
export async function apiRequest(path, options = {}) {
  const isFormData =
    typeof FormData !== "undefined" &&
    options.body instanceof FormData;

  const headers = {
    Accept: "application/json",

    // JSON requests need Content-Type; FormData must set its own boundary
    ...(!isFormData ? { "Content-Type": "application/json" } : {}),

    ...(authToken
      ? { Authorization: `Bearer ${authToken}` }
      : {}),

    ...options.headers,
  };

  // Don't force JSON Content-Type for FormData
  if (isFormData) {
    delete headers["Content-Type"];
    delete headers["content-type"];
  }

  console.log("API REQUEST:", `${API_BASE_URL}${path}`);
  console.log("METHOD:", options.method || "GET");
  console.log("UPLOAD TYPE:", isFormData ? "FormData" : "JSON");

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