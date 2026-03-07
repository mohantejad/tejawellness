import MealPlanCard from "@/components/meal-plans/MealPlanCard";
import { fetchMealPlans } from "@/api/meal-plans";
import type { MealPlan } from "@/types/meal-plans";

type SearchParams = {
  search?: string;
  goal?: string;
  min_duration?: string;
  max_duration?: string;
  min_meals?: string;
  max_meals?: string;
  min_price?: string;
  max_price?: string;
  ordering?: string;
};

export default async function MealPlansPage({ searchParams }: { searchParams: SearchParams }) {
  const plans: MealPlan[] = await fetchMealPlans(searchParams);

  return (
    <main className="container-page space-y-12 py-10 animate-in fade-in duration-1000">
      <div className="max-w-3xl space-y-4">
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-bold text-primary uppercase tracking-[0.4em]">The Regimen</span>
          <div className="h-px w-8 bg-primary/30" />
        </div>
        <h1 className="text-5xl md:text-7xl font-serif font-bold text-fg tracking-tight leading-tight">
          Bespoke Protocols
        </h1>
        <p className="text-xl text-mutedForeground font-serif italic leading-relaxed max-w-2xl">
          "Science-backed dietary paths curated for targeted cellular rejuvenation and beauty optimization."
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {plans.map((p) => (
          <MealPlanCard key={p.id} plan={p} />
        ))}
      </div>
    </main>
  );
}
