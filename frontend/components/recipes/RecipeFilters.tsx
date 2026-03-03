"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function RecipeFilters() {
  const router = useRouter();
  const sp = useSearchParams();

  const [search, setSearch] = useState(sp.get("search") ?? "");
  const [minCalories, setMinCalories] = useState(sp.get("min_calories") ?? "");
  const [maxCalories, setMaxCalories] = useState(sp.get("max_calories") ?? "");
  const [minProtein, setMinProtein] = useState(sp.get("min_protein") ?? "");
  const [maxProtein, setMaxProtein] = useState(sp.get("max_protein") ?? "");
  const [minCarbs, setMinCarbs] = useState(sp.get("min_carbs") ?? "");
  const [maxCarbs, setMaxCarbs] = useState(sp.get("max_carbs") ?? "");
  const [minFat, setMinFat] = useState(sp.get("min_fat") ?? "");
  const [maxFat, setMaxFat] = useState(sp.get("max_fat") ?? "");
  const [minFiber, setMinFiber] = useState(sp.get("min_fiber") ?? "");
  const [maxFiber, setMaxFiber] = useState(sp.get("max_fiber") ?? "");
  const [maxPrep, setMaxPrep] = useState(sp.get("max_prep_time") ?? "");
  const [maxCook, setMaxCook] = useState(sp.get("max_cook_time") ?? "");
  const [minServings, setMinServings] = useState(sp.get("min_servings") ?? "");
  const [difficulty, setDifficulty] = useState(sp.get("difficulty") ?? "");
  const [dietType, setDietType] = useState(sp.get("diet_type") ?? "");
  const [mealType, setMealType] = useState(sp.get("meal_type") ?? "");
  const [ordering, setOrdering] = useState(sp.get("ordering") ?? "-created_at");

  function apply() {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (minCalories) params.set("min_calories", minCalories);
    if (maxCalories) params.set("max_calories", maxCalories);
    if (minProtein) params.set("min_protein", minProtein);
    if (maxProtein) params.set("max_protein", maxProtein);
    if (minCarbs) params.set("min_carbs", minCarbs);
    if (maxCarbs) params.set("max_carbs", maxCarbs);
    if (minFat) params.set("min_fat", minFat);
    if (maxFat) params.set("max_fat", maxFat);
    if (minFiber) params.set("min_fiber", minFiber);
    if (maxFiber) params.set("max_fiber", maxFiber);
    if (maxPrep) params.set("max_prep_time", maxPrep);
    if (maxCook) params.set("max_cook_time", maxCook);
    if (minServings) params.set("min_servings", minServings);
    if (difficulty) params.set("difficulty", difficulty);
    if (dietType) params.set("diet_type", dietType);
    if (mealType) params.set("meal_type", mealType);
    if (ordering) params.set("ordering", ordering);
    router.push(`?${params.toString()}`);
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-soft space-y-4">
      <div className="text-sm font-semibold">Filters</div>
      <div className="space-y-3">
      <input className="rounded-xl border border-border px-3 py-2"
        value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search" />

      <select className="rounded-xl border border-border px-3 py-2"
        value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
        <option value="">Difficulty</option>
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
      </select>
      <select className="rounded-xl border border-border px-3 py-2"
        value={dietType} onChange={(e) => setDietType(e.target.value)}>
        <option value="">Diet type</option>
        <option value="balanced">Balanced</option>
        <option value="high-protein">High protein</option>
        <option value="vegan">Vegan</option>
        <option value="paleo">Paleo</option>
      </select>
      <select className="rounded-xl border border-border px-3 py-2"
        value={mealType} onChange={(e) => setMealType(e.target.value)}>
        <option value="">Meal type</option>
        <option value="breakfast">Breakfast</option>
        <option value="lunch">Lunch</option>
        <option value="dinner">Dinner</option>
        <option value="snack">Snack</option>
      </select>

      <div className="text-xs text-mutedForeground mt-2">Macros</div>
      <input className="rounded-xl border border-border px-3 py-2"
        value={minCalories} onChange={(e) => setMinCalories(e.target.value)} placeholder="Min kcal" />
      <input className="rounded-xl border border-border px-3 py-2"
        value={maxCalories} onChange={(e) => setMaxCalories(e.target.value)} placeholder="Max kcal" />
      <input className="rounded-xl border border-border px-3 py-2"
        value={minProtein} onChange={(e) => setMinProtein(e.target.value)} placeholder="Min protein" />
      <input className="rounded-xl border border-border px-3 py-2"
        value={maxProtein} onChange={(e) => setMaxProtein(e.target.value)} placeholder="Max protein" />
      <input className="rounded-xl border border-border px-3 py-2"
        value={minCarbs} onChange={(e) => setMinCarbs(e.target.value)} placeholder="Min carbs" />
      <input className="rounded-xl border border-border px-3 py-2"
        value={maxCarbs} onChange={(e) => setMaxCarbs(e.target.value)} placeholder="Max carbs" />
      <input className="rounded-xl border border-border px-3 py-2"
        value={minFat} onChange={(e) => setMinFat(e.target.value)} placeholder="Min fat" />
      <input className="rounded-xl border border-border px-3 py-2"
        value={maxFat} onChange={(e) => setMaxFat(e.target.value)} placeholder="Max fat" />
      <input className="rounded-xl border border-border px-3 py-2"
        value={minFiber} onChange={(e) => setMinFiber(e.target.value)} placeholder="Min fiber" />
      <input className="rounded-xl border border-border px-3 py-2"
        value={maxFiber} onChange={(e) => setMaxFiber(e.target.value)} placeholder="Max fiber" />
      <input className="rounded-xl border border-border px-3 py-2"
        value={maxPrep} onChange={(e) => setMaxPrep(e.target.value)} placeholder="Max prep (min)" />
      <input className="rounded-xl border border-border px-3 py-2"
        value={maxCook} onChange={(e) => setMaxCook(e.target.value)} placeholder="Max cook (min)" />
      <input className="rounded-xl border border-border px-3 py-2"
        value={minServings} onChange={(e) => setMinServings(e.target.value)} placeholder="Min servings" />

      <div className="text-xs text-mutedForeground mt-2">Sort</div>
      <select className="rounded-xl border border-border px-3 py-2"
        value={ordering} onChange={(e) => setOrdering(e.target.value)}>
        <option value="-created_at">Newest</option>
        <option value="calories">Calories ↑</option>
        <option value="-calories">Calories ↓</option>
        <option value="protein">Protein ↑</option>
        <option value="-protein">Protein ↓</option>
        <option value="carbs">Carbs ↑</option>
        <option value="-carbs">Carbs ↓</option>
        <option value="fat">Fat ↑</option>
        <option value="-fat">Fat ↓</option>
        <option value="-average_rating">Rating</option>
      </select>
      <button onClick={apply}
        className="rounded-xl bg-primary text-primaryForeground py-2 w-full">
        Apply
      </button>
      </div>
    </div>
  );
}
