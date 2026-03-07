import Image from "next/image";
import { fetchIngredient } from "@/api/ingredients";
import type { Ingredient } from "@/types/ingredients";
import Link from "next/link";
import { ChevronLeft, Info, ShoppingBag, Sparkles } from "lucide-react";

export default async function IngredientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const ingredient: Ingredient = await fetchIngredient(Number(id));

  const image = ingredient.primary_image || ingredient.media?.[0]?.image_url;
  const typeLabel = ingredient.ingredient_type?.replace(/_/g, ' ') || 'Ingredient';

  return (
    <main className="container-page py-12 animate-in fade-in duration-1000">
      <Link href="/ingredients" className="inline-flex items-center text-xs font-bold text-mutedForeground hover:text-primary uppercase tracking-[0.2em] mb-8 transition-colors group">
        <ChevronLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
        Back to Ingredients
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        <section className="lg:col-span-7 space-y-10">
          <div className="relative aspect-[3/2] w-full overflow-hidden rounded-[2.5rem] shadow-rose border border-border">
            {image ? (
              <Image
                src={image}
                alt={ingredient.name}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="h-full w-full bg-muted/40 flex items-center justify-center text-mutedForeground font-serif italic text-2xl">
                {ingredient.name}
              </div>
            )}
            <div className="absolute top-6 left-6">
              <span className="badge-pill bg-white/90 backdrop-blur-sm shadow-md border-none px-4 py-2 text-xs">{typeLabel}</span>
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-fg leading-tight">
              {ingredient.name}
            </h1>
            <p className="text-xl text-mutedForeground leading-relaxed max-w-2xl italic font-serif">
              {ingredient.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
            {ingredient.goal_links && ingredient.goal_links.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-primary">
                  <Sparkles size={18} />
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em]">Benefits</h3>
                </div>
                <div className="space-y-4">
                  {ingredient.goal_links.map((g) => (
                    <div key={g.goal?.slug} className="card-soft p-5 group hover:bg-surface transition-colors">
                      <div className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">{g.goal.name}</div>
                      <p className="text-sm text-fg leading-relaxed">{g.benefit_text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-6">
              <div className="flex items-center gap-2 text-accent">
                <Info size={18} />
                <h3 className="text-xs font-bold uppercase tracking-[0.2em]">Bio-Available Profile</h3>
              </div>

              {(ingredient.vitamins?.length || 0) > 0 && (
                <div className="space-y-3">
                  <h4 className="text-[10px] font-bold text-mutedForeground uppercase tracking-widest">Vitamins</h4>
                  <div className="flex flex-wrap gap-2">
                    {ingredient.vitamins?.map(v => (
                      <span key={v.id} className="inline-flex items-center px-3 py-1.5 rounded-full bg-primary/5 border border-primary/10 text-[10px] font-bold text-primary">
                        {v.name} · {v.percent_dv}% DV
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {(ingredient.minerals?.length || 0) > 0 && (
                <div className="space-y-3">
                  <h4 className="text-[10px] font-bold text-mutedForeground uppercase tracking-widest">Minerals</h4>
                  <div className="flex flex-wrap gap-2">
                    {ingredient.minerals?.map(m => (
                      <span key={m.id} className="inline-flex items-center px-3 py-1.5 rounded-full bg-accent/5 border border-accent/10 text-[10px] font-bold text-accent">
                        {m.name} · {m.percent_dv}% DV
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {(ingredient.micronutrients?.length || 0) > 0 && (
                <div className="space-y-3">
                  <h4 className="text-[10px] font-bold text-mutedForeground uppercase tracking-widest">Phytonutrients</h4>
                  <div className="flex flex-wrap gap-2">
                    {ingredient.micronutrients?.map(mic => (
                      <span key={mic.id} className="inline-flex items-center px-3 py-1.5 rounded-full bg-surface-dark/5 border border-surface-dark/10 text-[10px] font-bold text-surface-dark/60">
                        {mic.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        <aside className="lg:col-span-1" />

        <aside className="lg:col-span-4 space-y-8 sticky top-24">
          <div className="card-soft p-10 bg-surface/50 space-y-8">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-primary text-center">Nourishment Analysis</h3>

            <div className="grid grid-cols-2 gap-y-8 gap-x-4">
              <div className="text-center">
                <div className="text-3xl font-serif font-bold text-fg">{ingredient.calories ?? 0}</div>
                <div className="text-[10px] font-bold text-mutedForeground uppercase tracking-widest mt-1">Calories</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-serif font-bold text-fg">{ingredient.protein ?? 0}g</div>
                <div className="text-[10px] font-bold text-mutedForeground uppercase tracking-widest mt-1">Protein</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-serif font-bold text-fg">{ingredient.carbs ?? 0}g</div>
                <div className="text-[10px] font-bold text-mutedForeground uppercase tracking-widest mt-1">Carbs</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-serif font-bold text-fg">{ingredient.fat ?? 0}g</div>
                <div className="text-[10px] font-bold text-mutedForeground uppercase tracking-widest mt-1">Healthy Fats</div>
              </div>
            </div>

            <div className="pt-8 border-t border-border/50 text-center">
              <div className="text-3xl font-serif font-bold text-fg">{ingredient.fiber ?? 0}g</div>
              <div className="text-[10px] font-bold text-mutedForeground uppercase tracking-widest mt-1">Dietary Fiber</div>
            </div>
          </div>

          {ingredient.buy_url && (
            <Link
              href={ingredient.buy_url}
              target="_blank"
              className="btn-primary w-full flex items-center justify-center gap-3 py-5 shadow-rose hover:scale-[1.02]"
            >
              <ShoppingBag size={20} />
              Experience this Ingredient
            </Link>
          )}

          <div className="text-center">
            <p className="text-[10px] text-mutedForeground uppercase tracking-widest leading-relaxed">
              Serving size: 100g <br />
              Nourishment values are approximate
            </p>
          </div>
        </aside>
      </div>
    </main >
  );
}
