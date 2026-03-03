import { fetchMealPlan } from "@/api/meal-plans";
import type { MealPlan } from "@/types/meal-plans";
import Image from "next/image";

export default async function MealPlanDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const plan: MealPlan = await fetchMealPlan(Number(id));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{plan.title}</h1>
        <p className="text-sm text-mutedForeground">{plan.description}</p>
        <div className="text-sm text-mutedForeground mt-2">
          {plan.duration_days ?? 7} days · {plan.meals_per_day ?? 3} meals/day
        </div>
      </div>

      <div className="space-y-4">
        {plan.items?.map((item) => (
          <div key={item.id} className="rounded-2xl border border-border bg-card p-4 flex gap-4">
            {item.recipe?.primary_image ? (
              <Image
                src={item.recipe.primary_image}
                alt={item.recipe.title}
                width={180}
                height={120}
                className="rounded-xl object-cover h-24 w-32"
              />
            ) : (
              <div className="h-24 w-32 rounded-xl bg-muted" />
            )}
            <div className="space-y-1">
              <div className="text-xs text-mutedForeground">
                Day {item.day} · {item.meal_type}
              </div>
              <div className="font-semibold">{item.recipe?.title}</div>
              <div className="text-sm text-mutedForeground">
                {item.recipe?.calories ?? 0} kcal · {item.recipe?.protein ?? 0}g protein
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
