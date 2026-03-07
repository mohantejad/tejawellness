import { apiFetch } from "@/api/base";
import type { PaginatedResponse } from "@/types/api";
import type { Article, ArticleReview, ArticleComment } from "@/types/articles";
import { toQuery } from "./query";

export async function fetchArticlesByGoal(slug: string, filters: {
  search?: string;
  ordering?: string;
  page?: number;
} = {}) {
  const qs = toQuery({ goal: slug, ...filters });
  const data: PaginatedResponse<Article> = await apiFetch(`/api/articles/${qs}`);
  return data.results || [];
}

export async function fetchArticles(filters: {
  search?: string;
  ordering?: string;
  page?: number;
} = {}) {
  const qs = toQuery(filters);
  const data: PaginatedResponse<Article> = await apiFetch(`/api/articles/${qs}`);
  return data.results || [];
}


export async function fetchArticleById(id: string | number): Promise<Article> {
  return apiFetch(`/api/articles/${id}/`);
}

export async function toggleArticleLike(id: number) {
  return apiFetch(`/api/articles/${id}/like/`, { method: "POST" });
}

export async function fetchArticleReviews(id: number): Promise<ArticleReview[]> {
  return apiFetch(`/api/articles/${id}/reviews/`);
}

export async function createArticleReview(id: number, payload: { rating: number }) {
  return apiFetch(`/api/articles/${id}/reviews/`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function fetchArticleComments(id: number): Promise<ArticleComment[]> {
  const data = await apiFetch(`/api/articles/${id}/comments/`);
  return Array.isArray(data) ? data : (data.results ?? []);
}

export async function createArticleComment(
  id: number,
  payload: { text: string; parent?: number | null }
) {
  return apiFetch(`/api/articles/${id}/comments/`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
