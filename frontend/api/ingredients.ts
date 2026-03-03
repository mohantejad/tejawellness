import { apiFetch } from "@/api/base";

type IngredientQuery = {
  search?: string;
  goal?: string;
  ordering?: string;
  min_calories?: string;
  max_calories?: string;
  min_protein?: string;
  max_protein?: string;
  min_carbs?: string;
  max_carbs?: string;
  min_fat?: string;
  max_fat?: string;
};

export async function fetchIngredients(page = 1, query: IngredientQuery = {}) {
  const params = new URLSearchParams();
  params.set("page", String(page));
  if (query.search) params.set("search", query.search);
  if (query.goal) params.set("goal", query.goal);
  if (query.ordering) params.set("ordering", query.ordering);
  if (query.min_calories) params.set("min_calories", query.min_calories);
  if (query.max_calories) params.set("max_calories", query.max_calories);
  if (query.min_protein) params.set("min_protein", query.min_protein);
  if (query.max_protein) params.set("max_protein", query.max_protein);
  if (query.min_carbs) params.set("min_carbs", query.min_carbs);
  if (query.max_carbs) params.set("max_carbs", query.max_carbs);
  if (query.min_fat) params.set("min_fat", query.min_fat);
  if (query.max_fat) params.set("max_fat", query.max_fat);

  return apiFetch(`/api/ingredients/?${params.toString()}`);
}

export async function fetchIngredientsByGoal(
  goalSlug: string,
  page = 1,
  query: IngredientQuery = {}
) {
  const params = new URLSearchParams();
  params.set("goal", goalSlug);
  params.set("page", String(page));
  if (query.search) params.set("search", query.search);
  if (query.ordering) params.set("ordering", query.ordering);
  if (query.min_calories) params.set("min_calories", query.min_calories);
  if (query.max_calories) params.set("max_calories", query.max_calories);
  if (query.min_protein) params.set("min_protein", query.min_protein);
  if (query.max_protein) params.set("max_protein", query.max_protein);
  if (query.min_carbs) params.set("min_carbs", query.min_carbs);
  if (query.max_carbs) params.set("max_carbs", query.max_carbs);
  if (query.min_fat) params.set("min_fat", query.min_fat);
  if (query.max_fat) params.set("max_fat", query.max_fat);

  return apiFetch(`/api/ingredients/?${params.toString()}`);
}

export async function fetchIngredient(id: number) {
  return apiFetch(`/api/ingredients/${id}/`);
}
