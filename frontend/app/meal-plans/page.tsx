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
    <main className="container-page space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Meal Plans</h1>
        <p className="text-sm text-mutedForeground">Structured plans for your goals.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {plans.map((p) => (
          <MealPlanCard key={p.id} plan={p} />
        ))}
      </div>
    </main>
  );
}
