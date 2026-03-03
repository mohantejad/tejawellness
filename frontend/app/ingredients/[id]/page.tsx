import Image from "next/image";
import { fetchIngredient } from "@/api/ingredients";
import type { Ingredient } from "@/types/ingredients";
import Link from "next/link";

export default async function IngredientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const ingredient: Ingredient = await fetchIngredient(Number(id));

  const image = ingredient.media?.[0]?.image_url;
  console.log(ingredient)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <section className="lg:col-span-7 space-y-6">
        {image ? (
          <Image
            src={image}
            alt={ingredient.name}
            width={1200}
            height={800}
            className="rounded-3xl object-cover w-full h-96"
          />
        ) : (
          <div className="h-96 rounded-3xl bg-muted flex items-center justify-center">
            Ingredient
          </div>
        )}

        <div>
          <h1 className="text-4xl font-bold">{ingredient.name}</h1>
          <p className="text-mutedForeground mt-2">{ingredient.description}</p>
        </div>

        {ingredient.goal_links && ingredient.goal_links.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-semibold">Benefits by Goal</h3>
            {ingredient.goal_links.map((g) => (
              <div key={g.goal?.slug || g.goal?.id || g.benefit_text} className="text-sm text-mutedForeground">
                <span className="font-medium">{g.goal.name}: </span>
                {g.benefit_text}
              </div>
            ))}
          </div>
        )}
      </section>

      <aside className="lg:col-span-5 space-y-4">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
          <div className="text-lg font-semibold">Nutrition (per 100g)</div>
          <div className="text-sm text-mutedForeground mt-2">
            Calories: {ingredient.calories ?? 0} kcal
          </div>
          <div className="text-sm text-mutedForeground">Protein: {ingredient.protein ?? 0} g</div>
          <div className="text-sm text-mutedForeground">Carbs: {ingredient.carbs ?? 0} g</div>
          <div className="text-sm text-mutedForeground">Fat: {ingredient.fat ?? 0} g</div>
          <div className="text-sm text-mutedForeground">Fiber: {ingredient.fiber ?? 0} g</div>
        </div>

        {ingredient.buy_url && (
          <Link
            href={ingredient.buy_url}
            target="_blank"
            className="block text-center rounded-xl bg-primary text-primaryForeground py-3"
          >
            Buy Ingredient
          </Link>
        )}
      </aside>
    </div>
  );
}
