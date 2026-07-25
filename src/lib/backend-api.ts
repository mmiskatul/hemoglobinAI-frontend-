const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

function token() {
  if (typeof window === "undefined") return undefined;
  return window.localStorage.getItem("hemoglobin_access_token") || undefined;
}

export async function backendRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set("Content-Type", "application/json");
  const accessToken = token();
  if (accessToken) headers.set("Authorization", "Bearer " + accessToken);
  const response = await fetch(API_URL + path, { ...init, headers });
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
  me: () => backendRequest<{ id: string; name: string; email: string; role: string }>("/auth/me"),
  login: (email: string, password: string) => backendRequest<{ access_token: string }>("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),
  register: (payload: { name: string; email: string; password: string; role: string }) => backendRequest<{ access_token: string }>("/auth/register", { method: "POST", body: JSON.stringify(payload) }),
};

export const sectionApi = {
  notifications: () => backendRequest<{ notifications: unknown[] }>("/notifications"),
  donorAvailability: (available: boolean) => backendRequest("/donors/me/availability", { method: "PATCH", body: JSON.stringify({ available }) }),
  hospitalInventory: (bloodType: string, units: number) => backendRequest("/hospitals/inventory", { method: "PUT", body: JSON.stringify({ blood_type: bloodType, units }) }),
  hospitalOrder: (payload: Record<string, unknown>) => backendRequest("/hospitals/orders", { method: "POST", body: JSON.stringify({ metadata: payload }) }),
  hospitalBroadcast: (payload: Record<string, unknown>) => backendRequest("/hospitals/broadcasts", { method: "POST", body: JSON.stringify({ metadata: payload }) }),
  courierComplete: (taskId: string, proof: Record<string, unknown>) => backendRequest("/courier/tasks/" + taskId + "/complete", { method: "POST", body: JSON.stringify({ metadata: proof }) }),
  simulation: (payload: Record<string, unknown>) => backendRequest("/simulations/run", { method: "POST", body: JSON.stringify(payload) }),
  ledger: (recordId: string) => backendRequest("/ledger/" + encodeURIComponent(recordId)),
  controlRoomLog: (value: string) => backendRequest("/control-room/logs", { method: "POST", body: JSON.stringify({ value }) }),
  vitals: (payload: Record<string, unknown>) => backendRequest("/requester/vitals", { method: "POST", body: JSON.stringify(payload) }),
};
