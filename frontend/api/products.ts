import { apiFetch } from "@/api/base";
import type { PaginatedResponse } from "@/types/api";
import type { Product } from "@/types/products";
import { toQuery } from "./query";


export async function fetchProductsByGoal(slug: string, filters: {
  search?: string;
  min_price?: string;
  max_price?: string;
  in_stock?: boolean;
  ordering?: string;
} = {}, page = 1) {
  const qs = toQuery({ goal: slug, page, ...filters });
  const data: PaginatedResponse<Product> = await apiFetch(`/api/products/${qs}`);
  return data;
}

export async function fetchProducts(filters: {
  search?: string;
  min_price?: string;
  max_price?: string;
  in_stock?: boolean;
  ordering?: string;
} = {}, page = 1) {
  const qs = toQuery({ page, ...filters });
  const data: PaginatedResponse<Product> = await apiFetch(`/api/products/${qs}`);
  return data;
}


export async function fetchProductById(id: string | number) {
  return apiFetch(`/api/products/${id}/`);
}

export async function toggleProductLike(id: number) {
  return apiFetch(`/api/products/${id}/like/`, { method: "POST" });
}

export async function fetchProductReviews(id: number) {
  return apiFetch(`/api/products/${id}/reviews/`);
}

export async function createProductReview(
  id: number,
  payload: { rating: number }
) {
  return apiFetch(`/api/products/${id}/reviews/`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function fetchProductComments(id: number) {
  const data = await apiFetch(`/api/products/${id}/comments/`);
  return Array.isArray(data) ? data : (data.results ?? []);
}

export async function createProductComment(
  id: number,
  payload: { text: string; parent?: number | null }
) {
  return apiFetch(`/api/products/${id}/comments/`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
