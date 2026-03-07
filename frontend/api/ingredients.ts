import { apiFetch } from "@/api/base";
import type { IngredientType } from "@/types/ingredients";

type IngredientQuery = {
  search?:          string;
  goal?:            string;
  ordering?:        string;
  ingredient_type?: IngredientType;
  min_calories?:    string;
  max_calories?:    string;
  min_protein?:     string;
  max_protein?:     string;
  min_carbs?:       string;
  max_carbs?:       string;
  min_fat?:         string;
  max_fat?:         string;
  min_fiber?:       string;
  max_fiber?:       string;
};

function buildParams(page: number, query: IngredientQuery): URLSearchParams {
  const params = new URLSearchParams();
  params.set("page", String(page));
  if (query.search)          params.set("search",          query.search);
  if (query.goal)            params.set("goal",            query.goal);
  if (query.ordering)        params.set("ordering",        query.ordering);
  if (query.ingredient_type) params.set("ingredient_type", query.ingredient_type);
  if (query.min_calories)    params.set("min_calories",    query.min_calories);
  if (query.max_calories)    params.set("max_calories",    query.max_calories);
  if (query.min_protein)     params.set("min_protein",     query.min_protein);
  if (query.max_protein)     params.set("max_protein",     query.max_protein);
  if (query.min_carbs)       params.set("min_carbs",       query.min_carbs);
  if (query.max_carbs)       params.set("max_carbs",       query.max_carbs);
  if (query.min_fat)         params.set("min_fat",         query.min_fat);
  if (query.max_fat)         params.set("max_fat",         query.max_fat);
  if (query.min_fiber)       params.set("min_fiber",       query.min_fiber);
  if (query.max_fiber)       params.set("max_fiber",       query.max_fiber);
  return params;
}

export async function fetchIngredients(page = 1, query: IngredientQuery = {}) {
  return apiFetch(`/api/ingredients/?${buildParams(page, query).toString()}`);
}

export async function fetchIngredientsByGoal(
  goalSlug: string,
  page = 1,
  query: IngredientQuery = {}
) {
  return apiFetch(
    `/api/ingredients/?${buildParams(page, { ...query, goal: goalSlug }).toString()}`
  );
}

export async function fetchIngredient(id: number) {
  return apiFetch(`/api/ingredients/${id}/`);
}
