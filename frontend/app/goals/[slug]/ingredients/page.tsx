import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
    <main className="container-page py-12 space-y-12 animate-in fade-in duration-1000">
      {/* Editorial Header */}
      <div className="max-w-4xl space-y-4">
        <div className="flex items-center gap-3">
          <Link href={`/goals/${slug}`} className="text-[10px] font-bold text-primary uppercase tracking-[0.4em] hover:opacity-70 transition-opacity">
            {title} Sanctuary
          </Link>
          <div className="h-px w-8 bg-primary/30" />
          <span className="text-[10px] font-bold text-mutedForeground uppercase tracking-[0.4em]">Botanical Library</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-serif font-bold text-fg tracking-tight leading-tight capitalize">
          {title} Archivum
        </h1>
        <p className="text-xl text-mutedForeground font-serif italic leading-relaxed max-w-2xl">
          "A curated selection of potent botanicals specifically identified for their synergistic effects on {title}."
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Refined Codex Sidebar */}
        <aside className="lg:col-span-4">
          <div className="sticky top-28 space-y-8">
            <div className="p-8 rounded-[2rem] bg-white shadow-rose border-none space-y-8">
              <div className="space-y-2">
                <h3 className="text-xl font-serif font-bold text-fg">Refine the Codex</h3>
                <p className="text-[10px] text-primary font-bold uppercase tracking-widest opacity-60">Targeted {title} Filter</p>
              </div>

              <form className="space-y-6" method="get" action={`/goals/${slug}/ingredients`}>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-mutedForeground px-1">Botanical Search</label>
                  <input
                    name="search"
                    defaultValue={search}
                    placeholder="Search the archives..."
                    className="w-full rounded-2xl border border-primary/10 px-5 py-4 bg-surface text-sm focus:outline-none focus:ring-4 focus:ring-primary/5 focus:bg-white transition-all duration-300"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-mutedForeground px-1">Ordering</label>
                  <select
                    name="ordering"
                    defaultValue={ordering}
                    className="w-full rounded-2xl border border-primary/10 px-5 py-4 bg-surface text-sm appearance-none focus:outline-none focus:ring-4 focus:ring-primary/5 focus:bg-white transition-all duration-300"
                  >
                    <option value="">Default Codex Order</option>
                    <option value="name">Botanical A–Z</option>
                    <option value="-name">Botanical Z–A</option>
                    <option value="-protein">Protein Concentration</option>
                    <option value="-calories">Bio-Energy Rank</option>
                  </select>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-mutedForeground px-1">Macro Analysis</label>
                  <div className="grid grid-cols-2 gap-3">
                    <input name="min_calories" defaultValue={min_calories} placeholder="Min Kcal" className="input-soft" />
                    <input name="max_calories" defaultValue={max_calories} placeholder="Max Kcal" className="input-soft" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input name="min_protein" defaultValue={min_protein} placeholder="Min Protein" className="input-soft" />
                    <input name="max_protein" defaultValue={max_protein} placeholder="Max Protein" className="input-soft" />
                  </div>
                </div>

                <button className="btn-primary w-full py-4 text-[10px] uppercase tracking-[0.3em] shadow-rose mt-4">
                  Reveal Botanicals
                </button>
              </form>
            </div>

            {/* Aesthetic Quote */}
            <div className="p-8 text-center space-y-4 opacity-40">
              <div className="h-px w-12 bg-primary/30 mx-auto" />
              <p className="text-xs font-serif italic text-mutedForeground">"Where science meets botanical wisdom."</p>
            </div>
          </div>
        </aside>

        {/* Results Ritual */}
        <section className="lg:col-span-8 space-y-10">
          {items.length === 0 ? (
            <div className="h-[40vh] flex flex-col items-center justify-center text-center space-y-4">
              <div className="h-12 w-12 rounded-full border border-primary/20 flex items-center justify-center text-primary/40">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
                </svg>
              </div>
              <p className="text-mutedForeground font-serif italic">No botanical matches found in the {title} archives.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {items.map((i) => (
                <IngredientCard key={i.id} ingredient={i} />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="pt-12 border-t border-primary/10 flex items-center justify-between">
              <div className="text-[10px] font-bold text-mutedForeground uppercase tracking-widest">
                Entry {currentPage} of {totalPages}
              </div>
              <div className="flex items-center gap-4">
                <a
                  className={`h-12 w-12 rounded-full border border-border flex items-center justify-center text-mutedForeground hover:border-primary hover:text-primary transition-all duration-300 ${currentPage <= 1 ? "pointer-events-none opacity-20" : ""}`}
                  href={buildPageLink(currentPage - 1)}
                >
                  <ChevronLeft size={18} />
                </a>
                <a
                  className={`h-12 w-12 rounded-full border border-border flex items-center justify-center text-mutedForeground hover:border-primary hover:text-primary transition-all duration-300 ${currentPage >= totalPages ? "pointer-events-none opacity-20" : ""}`}
                  href={buildPageLink(currentPage + 1)}
                >
                  <ChevronRight size={18} />
                </a>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
