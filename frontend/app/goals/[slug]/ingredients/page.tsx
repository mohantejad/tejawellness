import IngredientCard from "@/components/ingredients/IngredientCard";
import { fetchIngredientsByGoal } from "@/api/ingredients";
import type { Ingredient } from "@/types/ingredients";

export default async function GoalIngredientsPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    page?: string;
    search?: string;
    ordering?: string;
    min_calories?: string;
    max_calories?: string;
    min_protein?: string;
    max_protein?: string;
    min_carbs?: string;
    max_carbs?: string;
    min_fat?: string;
    max_fat?: string;
  }>;
}) {
  const { slug } = await params;
  const {
    page = "1",
    search = "",
    ordering = "",
    min_calories = "",
    max_calories = "",
    min_protein = "",
    max_protein = "",
    min_carbs = "",
    max_carbs = "",
    min_fat = "",
    max_fat = "",
  } = await searchParams;

  const data = await fetchIngredientsByGoal(slug, Number(page), {
    search,
    ordering,
    min_calories,
    max_calories,
    min_protein,
    max_protein,
    min_carbs,
    max_carbs,
    min_fat,
    max_fat,
  });
  const items: Ingredient[] = data.results || [];
  const count = data.count || 0;
  const currentPage = Number(page) || 1;
  const perPage = items.length || 1;
  const totalPages = Math.max(1, Math.ceil(count / perPage));
  const title = slug.replace("-", " ");

  const buildPageLink = (p: number) => {
    const params = new URLSearchParams();
    params.set("page", String(p));
    if (search) params.set("search", search);
    if (ordering) params.set("ordering", ordering);
    if (min_calories) params.set("min_calories", min_calories);
    if (max_calories) params.set("max_calories", max_calories);
    if (min_protein) params.set("min_protein", min_protein);
    if (max_protein) params.set("max_protein", max_protein);
    if (min_carbs) params.set("min_carbs", min_carbs);
    if (max_carbs) params.set("max_carbs", max_carbs);
    if (min_fat) params.set("min_fat", min_fat);
    if (max_fat) params.set("max_fat", max_fat);
    return `/goals/${slug}/ingredients?${params.toString()}`;
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold capitalize">{title} Ingredients</h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <aside className="lg:col-span-4">
          <div className="sticky top-24 rounded-2xl border border-border bg-card p-4 shadow-soft space-y-4">
            <div className="text-sm font-semibold">Filters</div>
            <form className="space-y-3" method="get" action={`/goals/${slug}/ingredients`}>
              <input
                name="search"
                defaultValue={search}
                placeholder={`Search ${title} ingredients...`}
                className="w-full rounded-xl border border-border px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <select
                name="ordering"
                defaultValue={ordering}
                className="w-full rounded-xl border border-border px-4 py-3 bg-white"
              >
                <option value="">Sort by</option>
                <option value="name">Name A–Z</option>
                <option value="-name">Name Z–A</option>
                <option value="-protein">Protein high → low</option>
                <option value="-carbs">Carbs high → low</option>
                <option value="-fat">Fat high → low</option>
                <option value="-calories">Calories high → low</option>
              </select>
              <div className="text-xs text-mutedForeground">Macros</div>
              <input
                name="min_calories"
                defaultValue={min_calories}
                placeholder="Min kcal"
                className="w-full rounded-xl border border-border px-4 py-3 bg-white"
              />
              <input
                name="max_calories"
                defaultValue={max_calories}
                placeholder="Max kcal"
                className="w-full rounded-xl border border-border px-4 py-3 bg-white"
              />
              <input
                name="min_protein"
                defaultValue={min_protein}
                placeholder="Min protein"
                className="w-full rounded-xl border border-border px-4 py-3 bg-white"
              />
              <input
                name="max_protein"
                defaultValue={max_protein}
                placeholder="Max protein"
                className="w-full rounded-xl border border-border px-4 py-3 bg-white"
              />
              <input
                name="min_carbs"
                defaultValue={min_carbs}
                placeholder="Min carbs"
                className="w-full rounded-xl border border-border px-4 py-3 bg-white"
              />
              <input
                name="max_carbs"
                defaultValue={max_carbs}
                placeholder="Max carbs"
                className="w-full rounded-xl border border-border px-4 py-3 bg-white"
              />
              <input
                name="min_fat"
                defaultValue={min_fat}
                placeholder="Min fat"
                className="w-full rounded-xl border border-border px-4 py-3 bg-white"
              />
              <input
                name="max_fat"
                defaultValue={max_fat}
                placeholder="Max fat"
                className="w-full rounded-xl border border-border px-4 py-3 bg-white"
              />
              <button className="w-full rounded-xl bg-primary text-primaryForeground px-4 py-3">
                Apply
              </button>
            </form>
          </div>
        </aside>
        <section className="lg:col-span-8">
          {items.length === 0 && (
            <div className="text-mutedForeground">No ingredients found for this goal.</div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {items.map((i) => (
              <IngredientCard key={i.id} ingredient={i} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between text-sm mt-6">
              <div className="text-mutedForeground">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex items-center gap-2">
                <a
                  className={`px-3 py-2 rounded-lg border border-border ${currentPage <= 1 ? "pointer-events-none opacity-50" : ""}`}
                  href={buildPageLink(currentPage - 1)}
                >
                  Prev
                </a>
                <a
                  className={`px-3 py-2 rounded-lg border border-border ${currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}`}
                  href={buildPageLink(currentPage + 1)}
                >
                  Next
                </a>
              </div>
            </div>
          )}
        </section>
      </div>

    </div>
  );
}
