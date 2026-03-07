import type { Goal } from "./goals";
import type { Recipe } from "./recipes";

export type MealPlanItem = {
  id: number;
  day: number;
  meal_type: string;
  order: number;
  recipe: {
    id: number;
    title: string;
    primary_image?: string | null;
    calories?: number;
    protein?: number;
    prep_time?: number;
  };
};

export type MealPlan = {
  id: number;
  title: string;
  slug: string;
  description?: string;
  duration_days?: number;
  meals_per_day?: number;
  price?: string | number | null;
  goal?: Goal | null;
  items?: MealPlanItem[];
  total_recipes?: number;
};
