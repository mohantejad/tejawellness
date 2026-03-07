import type { Goal } from "./goals";

export type IngredientVitamin = {
  id: number;
  name: string;
  percent_dv: number;
};

export type IngredientMineral = {
  id: number;
  name: string;
  percent_dv: number;
};

export type IngredientMicronutrient = {
  id: number;
  name: string;
};

export type IngredientGoalLink = {
  id: number;
  goal: Goal;
  benefit_text: string;
};

export type IngredientType =
  | "nuts_and_seeds"
  | "fruits"
  | "vegetables"
  | "meats_and_animal_products"
  | "grains_and_legumes"
  | "herbs_and_spices";

export type Ingredient = {
  id: number;
  name: string;
  slug: string;
  ingredient_type: IngredientType;
  description?: string;

  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  fiber?: number;

  buy_url?: string;
  primary_image?: string | null;
  media?: { id: number; image_url?: string; video_url?: string }[];

  vitamins?: IngredientVitamin[];
  minerals?: IngredientMineral[];
  micronutrients?: IngredientMicronutrient[];
  goal_links?: IngredientGoalLink[];
};
