import Link from "next/link";
import Image from "next/image";
import type { MealPlan } from "@/types/meal-plans";

export default function MealPlanCard({ plan }: { plan: MealPlan }) {
  const image = plan.items?.[0]?.recipe?.primary_image;
  return (
    <Link
      href={`/meal-plans/${plan.id}`}
      className="group rounded-2xl border border-border bg-card overflow-hidden hover:-translate-y-1 transition"
    >
      {image ? (
        <Image src={image} alt={plan.title} width={600} height={320} className="h-28 w-full object-cover" />
      ) : (
        <div className="h-28 bg-muted" />
      )}
      <div className="p-4">
        <div className="text-sm text-mutedForeground">Meal Plan</div>
        <div className="text-lg font-semibold group-hover:text-primary transition">
          {plan.title}
        </div>
        <div className="text-xs text-mutedForeground mt-1">
          {plan.duration_days ?? 7} days · {plan.meals_per_day ?? 3} meals/day
        </div>
      </div>
    </Link>
  );
}
