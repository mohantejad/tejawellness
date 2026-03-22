export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE ?? "https://tejawellness.onrender.com";

export async function apiFetch(input: string, init: RequestInit = {}) {
  const url = `${API_BASE}${input}`;

  try {
    const res = await fetch(url, {
      credentials: "include",
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(init.headers || {}),
      },
    });

    if (res.status === 244) return {};
    if (res.status === 204) return {};
    if (res.status === 401 && url.endsWith("/auth/users/me/")) return null;

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
        return retry.json().catch(() => ({}));
      }
    }

    if (!res.ok) {
      return {}; // Build safety: return empty instead of crashing
    }

    return res.json().catch(() => ({}));
  } catch (error) {
    console.error(`API Fetch Error [${url}]:`, error);
    return {}; // Return empty object to prevent build hang/fail
  }
}
