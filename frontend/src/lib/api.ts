export interface AuthUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface AuthResult extends AuthUser {
  token: string;
}

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export class ApiError extends Error {
  status: number;
  fields?: Record<string, string>;

  constructor(status: number, message: string, fields?: Record<string, string>) {
    super(message);
    this.status = status;
    this.fields = fields;
  }
}

// In development this is empty, so requests are relative (e.g. "/auth/login")
// and the Vite dev server proxies them to the backend. In production the
// frontend is served as static files, so point it at the deployed backend by
// setting VITE_API_BASE_URL (e.g. "https://api.yourdomain.com").
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/$/, "");

async function request<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const text = await res.text();
  const data = text ? JSON.parse(text) : {};

  if (!res.ok) {
    throw new ApiError(res.status, data.message ?? "Request failed", data.fields);
  }
  return data as T;
}

export const authApi = {
  register: (payload: RegisterPayload) => request<AuthResult>("/auth/register", payload),
  login: (payload: LoginPayload) => request<AuthResult>("/auth/login", payload),
};
