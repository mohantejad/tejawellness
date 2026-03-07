import Link from "next/link";
import MealPlanCard from "@/components/meal-plans/MealPlanCard";
import { fetchMealPlansByGoal } from "@/api/meal-plans";
import type { MealPlan } from "@/types/meal-plans";

export default async function GoalMealPlansPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const plans: MealPlan[] = await fetchMealPlansByGoal(slug);
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
          <span className="text-[10px] font-bold text-mutedForeground uppercase tracking-[0.4em]">Bespoke Protocols</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-serif font-bold text-fg tracking-tight leading-tight capitalize">
          {title} Regimens
        </h1>
        <p className="text-xl text-mutedForeground font-serif italic leading-relaxed max-w-2xl">
          "Systematic nutritional architectures designed to optimize {title} through precision-engineered daily meal sequences."
        </p>
      </div>

      <section className="pt-8">
        {plans.length === 0 ? (
          <div className="h-[40vh] flex flex-col items-center justify-center text-center space-y-4">
            <p className="text-mutedForeground font-serif italic">No bespoke protocols are currently available in the {title} sanctuary.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {plans.map((p) => (
              <MealPlanCard key={p.id} plan={p} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
