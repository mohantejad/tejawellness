import { apiFetch } from "@/api/base";

export type MixedRecommendation = {
  type: "recipe" | "product" | "meal_plan";
  id: number;
  title: string;
  goal: string;
};

export type RecommendedGoal = {
  id: number;
  name: string;
  slug: string;
  description?: string;
};

export async function fetchMixedRecommendations() {
  return apiFetch("/api/recommendations/") as Promise<MixedRecommendation[]>;
}

export async function fetchRecommendedGoals() {
  return apiFetch("/api/goals/recommended/") as Promise<RecommendedGoal[]>;
}
