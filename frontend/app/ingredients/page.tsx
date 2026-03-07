import IngredientCard from "@/components/ingredients/IngredientCard";
import { fetchIngredients } from "@/api/ingredients";
import type { Ingredient, IngredientType } from "@/types/ingredients";

export default async function IngredientsPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    search?: string;
    goal?: string;
    ingredient_type?: string;
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
  const {
    page = "1",
    search = "",
    goal = "",
    ingredient_type = "",
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

  const data = await fetchIngredients(Number(page), {
    search,
    goal,
    ingredient_type: ingredient_type as IngredientType,
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
  const perPage = 12; // Assuming 12 per page on backend
  const totalPages = Math.max(1, Math.ceil(count / perPage));

  const buildPageLink = (p: number) => {
    const params = new URLSearchParams();
    params.set("page", String(p));
    if (search) params.set("search", search);
    if (goal) params.set("goal", goal);
    if (ingredient_type) params.set("ingredient_type", ingredient_type);
    if (ordering) params.set("ordering", ordering);
    if (min_calories) params.set("min_calories", min_calories);
    if (max_calories) params.set("max_calories", max_calories);
    if (min_protein) params.set("min_protein", min_protein);
    if (max_protein) params.set("max_protein", max_protein);
    if (min_carbs) params.set("min_carbs", min_carbs);
    if (max_carbs) params.set("max_carbs", max_carbs);
    if (min_fat) params.set("min_fat", min_fat);
    if (max_fat) params.set("max_fat", max_fat);
    return `/ingredients?${params.toString()}`;
  };

  return (
    <div className="container-page space-y-12 py-10 animate-in fade-in duration-1000">
      <div className="max-w-3xl space-y-4">
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-bold text-primary uppercase tracking-[0.4em]">The Codex</span>
          <div className="h-px w-8 bg-primary/30" />
        </div>
        <h1 className="text-5xl md:text-7xl font-serif font-bold text-fg tracking-tight leading-tight">
          The Botanical Library
        </h1>
        <p className="text-xl text-mutedForeground font-serif italic leading-relaxed max-w-2xl">
          "The architectural foundations of radiance. A curated codex of bespoke nutrients designed for cellular resilience and lasting glow."
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <aside className="lg:col-span-3">
          <div className="sticky top-24 card-soft p-6 space-y-6">
            <div className="flex items-center gap-2 text-primary">
              <span className="text-xs font-bold uppercase tracking-[0.2em]">Refine the Codex</span>
            </div>

            <form className="space-y-4" method="get" action="/ingredients">
              <div className="space-y-2">
                <label className="text-xs font-bold text-fg uppercase tracking-widest">Botanical Search</label>
                <input
                  name="search"
                  defaultValue={search}
                  placeholder="e.g. Turmeric, Omega-3"
                  className="w-full rounded-xl border border-border px-4 py-3 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-fg uppercase tracking-widest">Category</label>
                <select
                  name="ingredient_type"
                  defaultValue={ingredient_type}
                  className="w-full rounded-xl border border-border px-4 py-3 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
                >
                  <option value="">All Categories</option>
                  <option value="fruits">Fruits</option>
                  <option value="leafy_greens_and_vegetables">Leafy Greens & Veggies</option>
                  <option value="nuts_and_seeds">Nuts & Seeds</option>
                  <option value="grains_and_legumes">Grains & Legumes</option>
                  <option value="meats_and_animal_products">Animal Products</option>
                  <option value="herbs_and_spices">Herbs & Spices</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-fg uppercase tracking-widest">Goal</label>
                <input
                  name="goal"
                  defaultValue={goal}
                  placeholder="e.g. skin-care"
                  className="w-full rounded-xl border border-border px-4 py-3 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-fg uppercase tracking-widest">Sort By</label>
                <select
                  name="ordering"
                  defaultValue={ordering}
                  className="w-full rounded-xl border border-border px-4 py-3 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
                >
                  <option value="">Default</option>
                  <option value="name">Name A–Z</option>
                  <option value="-name">Name Z–A</option>
                  <option value="-protein">Highest Protein</option>
                  <option value="-calories">Highest Calories</option>
                </select>
              </div>

              <div className="pt-4 border-t border-border/50 space-y-4">
                <div className="text-[10px] font-bold text-mutedForeground uppercase tracking-widest">Nourishment Range</div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    name="min_calories"
                    defaultValue={min_calories}
                    placeholder="Min Kcal"
                    className="w-full rounded-xl border border-border px-3 py-2 bg-white text-xs"
                  />
                  <input
                    name="max_calories"
                    defaultValue={max_calories}
                    placeholder="Max Kcal"
                    className="w-full rounded-xl border border-border px-3 py-2 bg-white text-xs"
                  />
                </div>
              </div>

              <button className="btn-primary w-full mt-4 py-4 text-[10px] uppercase tracking-[0.2em]">
                Reveal Botanicals
              </button>

              {Object.keys(await searchParams).length > 0 && (
                <a href="/ingredients" className="block text-center text-xs font-bold text-mutedForeground hover:text-primary transition uppercase tracking-widest pt-2">
                  Clear All
                </a>
              )}
            </form>
          </div>
        </aside>

        <section className="lg:col-span-9">
          {items.length === 0 ? (
            <div className="card-soft p-20 text-center text-mutedForeground">
              <p className="text-lg font-serif">We couldn't find any ingredients matching your criteria.</p>
              <a href="/ingredients" className="text-primary font-bold inline-block mt-4 uppercase tracking-widest text-xs border-b border-primary pb-1">Reset Filters</a>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((i) => (
                  <IngredientCard key={i.id} ingredient={i} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-border mt-12 pt-8">
                  <div className="text-xs font-bold text-mutedForeground uppercase tracking-widest">
                    Showing Page <span className="text-fg">{currentPage}</span> of {totalPages}
                  </div>
                  <div className="flex items-center gap-3">
                    <a
                      className={`btn-outline min-w-[100px] py-2 text-xs uppercase tracking-widest ${currentPage <= 1 ? "pointer-events-none opacity-30 shadow-none border-border/30" : ""}`}
                      href={buildPageLink(currentPage - 1)}
                    >
                      Prev
                    </a>
                    <a
                      className={`btn-outline min-w-[100px] py-2 text-xs uppercase tracking-widest ${currentPage >= totalPages ? "pointer-events-none opacity-30 shadow-none border-border/30" : ""}`}
                      href={buildPageLink(currentPage + 1)}
                    >
                      Next
                    </a>
                  </div>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
}
