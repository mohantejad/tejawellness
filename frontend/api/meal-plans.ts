import { apiFetch } from "@/api/base";
import type { PaginatedResponse } from "@/types/api";
import type { MealPlan } from "@/types/meal-plans";
import { toQuery } from "@/api/query";

export async function fetchMealPlans(filters: {
  search?: string;
  goal?: string;
  min_duration?: string;
  max_duration?: string;
  min_meals?: string;
  max_meals?: string;
  min_price?: string;
  max_price?: string;
  ordering?: string;
} = {}) {
  const qs = toQuery(filters);
  const data: PaginatedResponse<MealPlan> = await apiFetch(`/api/meal-plans/${qs}`);
  return data.results || [];
}

export async function fetchMealPlansByGoal(slug: string, filters: {
  search?: string;
  min_duration?: string;
  max_duration?: string;
  min_meals?: string;
  max_meals?: string;
  min_price?: string;
  max_price?: string;
  ordering?: string;
} = {}) {
  const qs = toQuery({ goal: slug, ...filters });
  const data: PaginatedResponse<MealPlan> = await apiFetch(`/api/meal-plans/${qs}`);
  return data.results || [];
}

export async function fetchMealPlan(id: number) {
  return apiFetch(`/api/meal-plans/${id}/`);
}
