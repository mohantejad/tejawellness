import { apiFetch } from "@/api/base";

export async function globalSearch(q: string) {
  return apiFetch(`/api/search/?q=${encodeURIComponent(q)}`);
}
