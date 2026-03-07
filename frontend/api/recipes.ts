import { apiFetch } from '@/api/base';
import type { Recipe } from '@/types/recipes';
import type { PaginatedResponse } from '@/types/api';
import { toQuery } from "@/api/query";

export async function fetchRecipesByGoal(slug: string, filters: {
  search?: string;
  min_calories?: string;
  max_calories?: string;
  min_protein?: string;
  max_protein?: string;
  min_carbs?: string;
  max_carbs?: string;
  min_fat?: string;
  max_fat?: string;
  min_fiber?: string;
  max_fiber?: string;
  max_prep_time?: string;
  max_cook_time?: string;
  min_servings?: string;
  difficulty?: string;
  diet_type?: string;
  meal_type?: string;
  ordering?: string;
  page?: number;
} = {}) {
  const qs = toQuery({ goal: slug, ...filters });
  const data: PaginatedResponse<Recipe> = await apiFetch(`/api/recipes/${qs}`);
  return data.results || [];
}

export async function fetchRecipes(filters: {
  search?: string;
  min_calories?: string;
  max_calories?: string;
  min_protein?: string;
  max_protein?: string;
  min_carbs?: string;
  max_carbs?: string;
  min_fat?: string;
  max_fat?: string;
  min_fiber?: string;
  max_fiber?: string;
  max_prep_time?: string;
  max_cook_time?: string;
  min_servings?: string;
  difficulty?: string;
  diet_type?: string;
  meal_type?: string;
  ordering?: string;
  page?: number;
} = {}) {
  const qs = toQuery(filters);
  const data: PaginatedResponse<Recipe> = await apiFetch(`/api/recipes/${qs}`);
  return data.results || [];
}

export async function fetchRecipe(id: number) {
  return apiFetch(`/api/recipes/${id}/`);
}

export async function toggleRecipeLike(id: number) {
  return apiFetch(`/api/recipes/${id}/like/`, { method: "POST" });
}

export async function toggleRecipeSave(id: number) {
  return apiFetch(`/api/recipes/${id}/save/`, { method: "POST" });
}

export async function createRecipeReview(id: number, payload: { rating: number }) {
  return apiFetch(`/api/recipes/${id}/reviews/`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function fetchRecipeComments(id: number) {
  return apiFetch(`/api/recipes/${id}/comments/`);
}

export async function createRecipeComment(
  id: number,
  payload: { text: string; parent?: number | null }
) {
  return apiFetch(`/api/recipes/${id}/comments/`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
