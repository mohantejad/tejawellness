export type MixedRecommendation = {
  type: "recipe" | "product" | "article";
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
