import RecipeFilters from '@/components/recipes/RecipeFilters';
import RecipeListServer from '@/components/recipes/RecipeListServer';
import { fetchRecipes } from '@/api/recipes';

type SearchParams = {
  search?: string;
  min_calories?: string;
  max_calories?: string;
  min_protein?: string;
  max_protein?: string;
  min_carbs?: string;
  max_carbs?: string;
  min_fat?: string;
  max_fat?: string;
  min_fiber?: string;
  max_fiber?: string;
  max_prep_time?: string;
  max_cook_time?: string;
  min_servings?: string;
  difficulty?: string;
  diet_type?: string;
  meal_type?: string;
  ordering?: string;
};

export default async function RecipesPage({ searchParams }: { searchParams: SearchParams }) {
  const recipes = await fetchRecipes(searchParams);

  return (
    <main className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Recipes</h1>
          <p className="text-sm text-mutedForeground">Browse all healthy meals.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <aside className="lg:col-span-4">
          <div className="sticky top-24">
            <RecipeFilters />
          </div>
        </aside>
        <section className="lg:col-span-8">
          <RecipeListServer recipes={recipes} />
        </section>
      </div>
    </main>
  );
}
