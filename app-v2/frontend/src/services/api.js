import { auth } from "./auth.js";

const BASE = import.meta.env.VITE_API_URL;

async function request(path, options = {}) {
  const token = await auth.token();

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.error || `Error HTTP ${res.status}`);
    err.status = res.status;
    err.modoDegradado = data.modoDegradado === true;
    throw err;
  }
  return data;
}

export const api = {
  health: () => request("/api/health"),
  me: () => request("/api/auth/me"),
  pedirPista: (payload) =>
    request("/api/ia/pista", { method: "POST", body: JSON.stringify(payload) }),
};
