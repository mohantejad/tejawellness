import type { Goal } from "./goals";

export type IngredientGoalLink = {
  id: number;
  goal: Goal;
  benefit_text: string;
};

export type Ingredient = {
  id: number;
  name: string;
  slug: string;
  description?: string;

  calories?: number;
  carbs?: number;
  protein?: number;
  fat?: number;
  fiber?: number;

  vitamin_a?: number;
  vitamin_c?: number;
  calcium?: number;
  iron?: number;
  potassium?: number;

  buy_url?: string;
  primary_image?: string | null;
  media?: { id: number; image_url?: string; video_url?: string }[];

  goal_links?: IngredientGoalLink[];
};
