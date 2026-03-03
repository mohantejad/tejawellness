"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { fetchRecipesByGoal } from "@/api/recipes";
import RecipeCard from "@/components/recipes/RecipeCard";
import type { Recipe } from "@/types/recipes";

export default function RecipeListClient({ slug }: { slug: string }) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const sp = useSearchParams();

  useEffect(() => {
    const filters = {
      search: sp.get("search") ?? undefined,
      min_calories: sp.get("min_calories") ?? undefined,
      max_calories: sp.get("max_calories") ?? undefined,
      min_protein: sp.get("min_protein") ?? undefined,
      max_protein: sp.get("max_protein") ?? undefined,
      min_carbs: sp.get("min_carbs") ?? undefined,
      max_carbs: sp.get("max_carbs") ?? undefined,
      min_fat: sp.get("min_fat") ?? undefined,
      max_fat: sp.get("max_fat") ?? undefined,
      min_fiber: sp.get("min_fiber") ?? undefined,
      max_fiber: sp.get("max_fiber") ?? undefined,
      max_prep_time: sp.get("max_prep_time") ?? undefined,
      max_cook_time: sp.get("max_cook_time") ?? undefined,
      min_servings: sp.get("min_servings") ?? undefined,
      difficulty: sp.get("difficulty") ?? undefined,
      diet_type: sp.get("diet_type") ?? undefined,
      meal_type: sp.get("meal_type") ?? undefined,
      ordering: sp.get("ordering") ?? undefined,
    };
    fetchRecipesByGoal(slug, filters).then(setRecipes).catch(() => setRecipes([]));
  }, [slug, sp]);

  if (recipes.length === 0) {
    return <div className="text-mutedForeground">No recipes found for this goal.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {recipes.map((r) => (
        <RecipeCard key={r.id} recipe={r} />
      ))}
    </div>
  );
}
