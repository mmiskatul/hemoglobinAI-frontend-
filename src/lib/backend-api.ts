const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

function token() {
  if (typeof window === "undefined") return undefined;
  return window.localStorage.getItem("hemoglobin_access_token") || undefined;
}

export type TokenResponse = { access_token: string; refresh_token: string; token_type: string };

export function storeTokens(result: TokenResponse) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem("hemoglobin_access_token", result.access_token);
  window.localStorage.setItem("hemoglobin_refresh_token", result.refresh_token);
}

async function refreshAccessToken() {
  if (typeof window === "undefined") return false;
  const refreshToken = window.localStorage.getItem("hemoglobin_refresh_token");
  if (!refreshToken) return false;
  const response = await fetch(API_URL + "/auth/refresh", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });
  if (!response.ok) return false;
  storeTokens(await response.json() as TokenResponse);
  return true;
}

export async function backendRequest<T>(path: string, init: RequestInit = {}, retry = true): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set("Content-Type", "application/json");
  const accessToken = token();
  if (accessToken) headers.set("Authorization", "Bearer " + accessToken);
  const response = await fetch(API_URL + path, { ...init, headers });
  if (response.status === 401 && retry && !path.startsWith("/auth/")) {
    if (await refreshAccessToken()) return backendRequest<T>(path, init, false);
  }
  if (!response.ok) {
    const detail = await response.json().catch(() => null);
    throw new Error(detail?.detail || detail?.error || "Backend request failed");
  }
  return response.json() as Promise<T>;
}

export const agentApi = {
  publicChat: (message: string, dashboard: string) => backendRequest<{ message: string }>("/agent/public-chat", { method: "POST", body: JSON.stringify({ message, dashboard }) }),
  chat: (message: string, dashboard: string, conversationId?: string) => backendRequest<{ conversation_id: string; message: string }>("/agent/chat", { method: "POST", body: JSON.stringify({ message, dashboard, conversation_id: conversationId }) }),
};

export const authApi = {
  me: () => backendRequest<{ id: string; name: string; email: string; role: string; profile?: Record<string, unknown> }>("/auth/me"),
  login: (email: string, password: string) => backendRequest<TokenResponse>("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),
  register: (payload: { name: string; email: string; password: string; role: string; details: Record<string, string> }) => backendRequest<{ verification_required: boolean; email: string; message: string }>("/auth/register", { method: "POST", body: JSON.stringify(payload) }),
  verifyEmail: (email: string, code: string) => backendRequest<TokenResponse>("/auth/verify-email", { method: "POST", body: JSON.stringify({ email, code }) }),
  resendVerification: (email: string) => backendRequest<{ message: string }>("/auth/resend-verification", { method: "POST", body: JSON.stringify({ email }) }),
  refresh: () => refreshAccessToken(),
  forgotPassword: (email: string) => backendRequest<{ message: string }>("/auth/forgot-password", { method: "POST", body: JSON.stringify({ email }) }),
  resetPassword: (email: string, code: string, password: string) => backendRequest<{ message: string }>("/auth/reset-password", { method: "POST", body: JSON.stringify({ email, code, password }) }),
};

export const sectionApi = {
  notifications: () => backendRequest<{ notifications: unknown[] }>("/notifications"),
  donorAvailability: (available: boolean) => backendRequest("/donors/me/availability", { method: "PATCH", body: JSON.stringify({ available }) }),
  hospitalInventory: (bloodType: string, units: number) => backendRequest("/hospitals/inventory", { method: "PUT", body: JSON.stringify({ blood_type: bloodType, units }) }),
  hospitalOrder: (payload: Record<string, unknown>) => backendRequest("/hospitals/orders", { method: "POST", body: JSON.stringify({ metadata: payload }) }),
  hospitalBroadcast: (payload: Record<string, unknown>) => backendRequest("/hospitals/broadcasts", { method: "POST", body: JSON.stringify({ metadata: payload }) }),
  courierComplete: (taskId: string, proof: Record<string, unknown>) => backendRequest("/courier/tasks/" + taskId + "/complete", { method: "POST", body: JSON.stringify({ metadata: proof }) }),
  vitals: (payload: Record<string, unknown>) => backendRequest("/requester/vitals", { method: "POST", body: JSON.stringify(payload) }),
};

export type BangladeshLocation = { id: string; name: string; bn_name?: string };
const PUBLIC_LOCATION_API = "https://bdapis.pro.bd/geo/v2.0";
async function locationRequest(path: string) {
  try {
    return await backendRequest<{ data: BangladeshLocation[] }>(`/locations${path}`);
  } catch {
    const response = await fetch(PUBLIC_LOCATION_API + path);
    if (!response.ok) throw new Error("Bangladesh location data is unavailable");
    return response.json() as Promise<{ data: BangladeshLocation[] }>;
  }
}
export const locationApi = {
  divisions: () => locationRequest("/divisions"),
  districts: (divisionId: string) => locationRequest(`/districts/${divisionId}`),
  upazilas: (districtId: string) => locationRequest(`/upazilas/${districtId}`),
  unions: (upazilaId: string) => locationRequest(`/unions/${upazilaId}`),
};
