import Link from "next/link";
import RecipeListClient from "@/components/recipes/RecipeListClient";
import RecipeFilters from "@/components/recipes/RecipeFilters";

export default async function GoalRecipesPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const title = slug.replace("-", " ");

  return (
    <main className="container-page py-12 space-y-12 animate-in fade-in duration-1000">
      {/* Editorial Header */}
      <div className="max-w-4xl space-y-4">
        <div className="flex items-center gap-3">
          <Link href={`/goals/${slug}`} className="text-[10px] font-bold text-primary uppercase tracking-[0.4em] hover:opacity-70 transition-opacity">
            {title} Sanctuary
          </Link>
          <div className="h-px w-8 bg-primary/30" />
          <span className="text-[10px] font-bold text-mutedForeground uppercase tracking-[0.4em]">Culinary Rituals</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-serif font-bold text-fg tracking-tight leading-tight capitalize">
          {title} Gastronomy
        </h1>
        <p className="text-xl text-mutedForeground font-serif italic leading-relaxed max-w-2xl">
          "Nutrient-dense culinary protocols meticulously crafted to support {title} from within."
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <aside className="lg:col-span-4">
          <div className="sticky top-28">
            <RecipeFilters />
          </div>
        </aside>
        <section className="lg:col-span-8">
          <RecipeListClient slug={slug} />
        </section>
      </div>
    </main>
  );
}
