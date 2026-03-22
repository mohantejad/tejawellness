import ArticleDetailClient from "@/components/articles/ArticleDetailClient";
import ProductDetailClient from "@/components/products/ProductDetailClient";
import RecipeDetailClient from "@/components/recipes/RecipeDetailClient";
import IngredientDetailClient from "@/components/ingredients/IngredientDetailClient";
import MealPlanDetailClient from "@/components/meal-plans/MealPlanDetailClient";

import { fetchArticleById } from "@/api/articles";
import { fetchProductById } from "@/api/products";
import { fetchRecipeById } from "@/api/recipes";
import { fetchIngredientById } from "@/api/ingredients";
import { fetchMealPlanById } from "@/api/meal-plans";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function DynamicDetailPage({
  params,
}: {
  params: Promise<{ type: string; id: string }>;
}) {
  const { type, id } = await params;

  try {
    if (type === "articles") {
      const data = await fetchArticleById(Number(id));
      return <ArticleDetailClient article={data} />;
    }
    if (type === "products") {
      const data = await fetchProductById(Number(id));
      return <ProductDetailClient product={data} />;
    }
    if (type === "recipes") {
      const data = await fetchRecipeById(Number(id));
      return <RecipeDetailClient recipe={data} />;
    }
    if (type === "ingredients") {
      const data = await fetchIngredientById(Number(id));
      return <IngredientDetailClient ingredient={data} />;
    }
    if (type === "meal-plans") {
      const data = await fetchMealPlanById(Number(id));
      return <MealPlanDetailClient mealPlan={data} />;
    }
  } catch (_e) {
    return notFound();
  }

  return notFound();
}
