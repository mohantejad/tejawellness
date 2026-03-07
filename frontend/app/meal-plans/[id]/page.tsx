import { fetchMealPlan } from "@/api/meal-plans";
import type { MealPlan } from "@/types/meal-plans";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, Calendar, Clock, Utensils, Sparkles, ArrowRight } from "lucide-react";

export default async function MealPlanDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const plan: MealPlan = await fetchMealPlan(Number(id));

  return (
    <main className="container-page py-12 animate-in fade-in duration-1000">
      {/* Editorial Header */}
      <section className="mb-16 space-y-8">
        <Link href="/meal-plans" className="inline-flex items-center gap-2 text-xs font-bold text-mutedForeground uppercase tracking-[0.2em] hover:text-primary transition-colors group">
          <ChevronLeft size={14} className="transition-transform group-hover:-translate-x-1" />
          Back to Meal Plans
        </Link>

        <div className="flex flex-col md:flex-row items-start justify-between gap-10">
          <div className="max-w-3xl space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold text-primary uppercase tracking-[0.4em]">Plan Overview</span>
              <div className="h-px w-8 bg-primary/30" />
            </div>
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-fg tracking-tight leading-tight">
              {plan.title}
            </h1>
            <p className="text-xl text-mutedForeground font-serif italic leading-relaxed max-w-2xl">
              "{plan.description}"
            </p>
          </div>

          <div className="flex gap-6 pt-6 md:pt-0">
            <div className="flex flex-col items-center gap-2">
              <div className="h-16 w-16 rounded-3xl bg-surface flex items-center justify-center text-primary shadow-rose">
                <Calendar size={24} />
              </div>
              <span className="text-[10px] font-bold text-fg uppercase tracking-widest">{plan.duration_days ?? 7} Days</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="h-16 w-16 rounded-3xl bg-surface flex items-center justify-center text-accent shadow-rose">
                <Utensils size={24} />
              </div>
              <span className="text-[10px] font-bold text-fg uppercase tracking-widest">{plan.meals_per_day ?? 3} Daily</span>
            </div>
          </div>
        </div>
      </section>

      {/* Daily Sequence */}
      <section className="space-y-12">
        <div className="flex items-center gap-4 mb-2">
          <h2 className="text-2xl font-serif font-bold text-fg">The Daily Sequence</h2>
          <div className="h-px grow bg-border/40" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {plan.items?.map((item, idx) => (
            <div key={item.id} className="group relative">
              <Link href={`/recipes/${item.recipe?.id}`} className="block card-soft overflow-hidden hover:-translate-y-2 transition-all duration-500 bg-white border-none shadow-rose">
                <div className="relative h-56 w-full">
                  {item.recipe?.primary_image ? (
                    <Image
                      src={item.recipe.primary_image}
                      alt={item.recipe.title}
                      fill
                      className="object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                  ) : (
                    <div className="h-full w-full bg-muted/20 flex items-center justify-center">
                      <Sparkles className="text-muted-fg/20" size={32} />
                    </div>
                  )}
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="badge-pill bg-white/90 backdrop-blur-md px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-primary shadow-sm border-none">
                      Day {item.day}
                    </span>
                    <span className="badge-pill bg-fg/90 backdrop-blur-md px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white shadow-sm border-none">
                      {item.meal_type}
                    </span>
                  </div>
                </div>

                <div className="p-8 space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-xl font-serif font-bold text-fg group-hover:text-primary transition-colors">
                      {item.recipe?.title}
                    </h3>
                    <div className="flex items-center gap-4 text-[10px] font-bold text-mutedForeground uppercase tracking-widest">
                      <div className="flex items-center gap-1.5">
                        <Clock size={12} />
                        {item.recipe?.prep_time || 20}m
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Sparkles size={12} />
                        {item.recipe?.calories || 0} kcal
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-border/40 flex items-center justify-between text-[10px] font-bold text-primary uppercase tracking-[0.3em] group-hover:translate-x-1 transition-all duration-500">
                    Explore Recipe
                    <ArrowRight size={14} />
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Philosophy Callout */}
      <section className="mt-24 p-16 rounded-[3rem] bg-surface/50 text-center space-y-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 p-8 opacity-5">
          <Sparkles size={120} className="text-primary" />
        </div>
        <h3 className="text-3xl font-serif font-bold text-fg">Biological Consistency</h3>
        <p className="max-w-2xl mx-auto text-mutedForeground leading-relaxed italic font-serif">
          "The power of a wellness plan lies in its consistent nourishment. By following this sequence, you align your biological rhythms with the botanical strength of nature's finest ingredients."
        </p>
      </section>
    </main>
  );
}
