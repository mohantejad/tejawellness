import { fetchRecipe } from "@/api/recipes";
import type { Recipe } from "@/types/recipes";
import RecipeDetailClient from "@/components/recipes/RecipeDetailClient";

export default async function RecipeDetail(
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const recipe: Recipe = await fetchRecipe(Number(id));

  return <RecipeDetailClient recipe={recipe} />;
}
