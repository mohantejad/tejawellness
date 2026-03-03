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
    <div className="space-y-6">
      <h1 className="text-3xl font-bold capitalize">{title} Meal Plans</h1>

      {plans.length === 0 && (
        <div className="text-mutedForeground">No meal plans found for this goal.</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {plans.map((p) => (
          <MealPlanCard key={p.id} plan={p} />
        ))}
      </div>
    </div>
  );
}
