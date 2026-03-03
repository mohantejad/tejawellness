export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8000";

export async function apiFetch(input: string, init: RequestInit = {}) {
  const url = `${API_BASE}${input}`;

  const res = await fetch(url, {
    credentials: "include",
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
  });

  if (res.status === 204) {
    return {};
  }

  if (res.status === 401 && url.endsWith("/auth/users/me/")) {
    return null;
  }

  if (res.status === 401) {
    const refreshRes = await fetch(`${API_BASE}/auth/jwt/refresh/`, {
      method: "POST",
      credentials: "include",
    });

    if (refreshRes.ok) {
      const retry = await fetch(url, {
        credentials: "include",
        ...init,
        headers: {
          "Content-Type": "application/json",
          ...(init.headers || {}),
        },
      });

      if (!retry.ok) {
        const data = await retry.json().catch(() => ({}));
        throw new Error(data?.detail || data?.error || "Request failed");
      }
      return retry.json().catch(() => ({}));
    }
  }

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data?.detail || data?.error || "Request failed");
  }

  return res.json().catch(() => ({}));
}
