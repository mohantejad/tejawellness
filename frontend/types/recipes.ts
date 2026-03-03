export type RecipeMedia = {
  id: number;
  image_url?: string;
  video_url?: string;
  is_primary?: boolean;
  order?: number;
};

export type RecipeReview = {
  id: number;
  user: string;
  rating: number;
  created_at: string;
};

export type RecipeComment = {
  id: number;
  user: string;
  text: string;
  created_at: string;
  updated_at: string;
  replies?: RecipeComment[];
};

export type RecipeIngredient = {
  id: number;
  grams?: number;
  ingredient: {
    id: number;
    name: string;
  };
};

export type Recipe = {
  id: number;
  title: string;
  slug: string;
  description?: string;
  difficulty?: string;
  diet_type?: string;
  instructions?: string;
  meal_type?: string;
  meal_time?: string;
  prep_time?: number;
  cook_time?: number;
  servings?: number;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  fiber?: number;
  average_rating?: number;
  rating_count?: number;
  review_count?: number;
  comment_count?: number;
  like_count?: number;
  save_count?: number;
  is_liked?: boolean;
  is_saved?: boolean;
  primary_image?: string | null;
  primary_video?: string | null;
  media?: RecipeMedia[];
  recipe_ingredients?: RecipeIngredient[];
  reviews?: RecipeReview[];
};

export type RecipeCardData = {
  id: number;
  title: string;
  calories?: number;
  protein?: number;
  average_rating?: number;
  rating_count?: number;
  like_count?: number;
  is_liked?: boolean;
  primary_image?: string | null;
  media?: { image_url?: string }[];
};
