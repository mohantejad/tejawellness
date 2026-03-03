import RecipeListClient from "@/components/recipes/RecipeListClient";
import RecipeFilters from "@/components/recipes/RecipeFilters";

export default async function GoalRecipesPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold capitalize">{slug.replace("-", " ")} Recipes</h1>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <aside className="lg:col-span-4">
          <div className="sticky top-24">
            <RecipeFilters />
          </div>
        </aside>
        <section className="lg:col-span-8">
          <RecipeListClient slug={slug} />
        </section>
      </div>
    </div>
  );
}
