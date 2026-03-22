"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { Search, Utensils, Zap, ChefHat, Filter, ArrowRight } from "lucide-react";

export default function RecipeFilters() {
  const router = useRouter();
  const sp = useSearchParams();

  const [search, setSearch] = useState(sp.get("search") ?? "");
  const [minCalories, setMinCalories] = useState(sp.get("min_calories") ?? "");
  const [maxCalories, setMaxCalories] = useState(sp.get("max_calories") ?? "");
  const [minProtein, setMinProtein] = useState(sp.get("min_protein") ?? "");
  const [maxProtein, setMaxProtein] = useState(sp.get("max_protein") ?? "");
  const [difficulty, setDifficulty] = useState(sp.get("difficulty") ?? "");
  const [dietType, setDietType] = useState(sp.get("diet_type") ?? "");
  const [ordering, setOrdering] = useState(sp.get("ordering") ?? "-created_at");

  function apply() {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (minCalories) params.set("min_calories", minCalories);
    if (maxCalories) params.set("max_calories", maxCalories);
    if (minProtein) params.set("min_protein", minProtein);
    if (maxProtein) params.set("max_protein", maxProtein);
    if (difficulty) params.set("difficulty", difficulty);
    if (dietType) params.set("diet_type", dietType);
    if (ordering) params.set("ordering", ordering);
    router.push(`?${params.toString()}`);
  }

  return (
    <div className="p-8 rounded-[2rem] bg-white shadow-rose border-none space-y-8 animate-in fade-in slide-in-from-left-4 duration-700">
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-primary">
          <Filter size={16} />
          <h3 className="text-xl font-serif font-bold text-fg">Refine the Ritual</h3>
        </div>
        <p className="text-[10px] text-mutedForeground font-bold uppercase tracking-widest opacity-60">Culinary Filters</p>
      </div>

      <div className="space-y-6">
        {/* Search */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-mutedForeground px-1">Keywords</label>
          <div className="relative">
            <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40" />
            <input
              className="w-full rounded-2xl border border-primary/10 pl-11 pr-4 py-3.5 bg-surface text-sm focus:outline-none focus:ring-4 focus:ring-primary/5 focus:bg-white transition-all duration-300"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search rituals..."
            />
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-mutedForeground px-1 flex items-center gap-2">
              <ChefHat size={12} className="text-primary/60" /> Difficulty Level
            </label>
            <select className="w-full rounded-2xl border border-primary/10 px-5 py-3.5 bg-surface text-sm appearance-none focus:outline-none focus:bg-white transition-all duration-300"
              value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
              <option value="">All Tiers</option>
              <option value="easy">Easy Preparation</option>
              <option value="medium">Intermediate Skill</option>
              <option value="hard">Expert Ritual</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-mutedForeground px-1 flex items-center gap-2">
              <Utensils size={12} className="text-primary/60" /> Dietary Philosophy
            </label>
            <select className="w-full rounded-2xl border border-primary/10 px-5 py-3.5 bg-surface text-sm appearance-none focus:outline-none focus:bg-white transition-all duration-300"
              value={dietType} onChange={(e) => setDietType(e.target.value)}>
              <option value="">Universal Path</option>
              <option value="balanced">Balanced Vitality</option>
              <option value="high-protein">Muscle Rejuvenation</option>
              <option value="vegan">Purely Botanical</option>
              <option value="paleo">Ancestral Nutrition</option>
            </select>
          </div>
        </div>

        {/* Nutritional Parameters */}
        <div className="space-y-4">
          <label className="text-[10px] font-bold uppercase tracking-widest text-mutedForeground px-1 flex items-center gap-2">
            <Zap size={12} className="text-primary/60" /> Bio-Metric Range
          </label>
          <div className="grid grid-cols-2 gap-3">
            <input className="input-soft"
              value={minCalories} onChange={(e) => setMinCalories(e.target.value)} placeholder="Min Kcal" />
            <input className="input-soft"
              value={maxCalories} onChange={(e) => setMaxCalories(e.target.value)} placeholder="Max Kcal" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input className="input-soft"
              value={minProtein} onChange={(e) => setMinProtein(e.target.value)} placeholder="Min Protein" />
            <input className="input-soft"
              value={maxProtein} onChange={(e) => setMaxProtein(e.target.value)} placeholder="Max Protein" />
          </div>
        </div>

        {/* Order */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-mutedForeground px-1">Sequence</label>
          <select className="w-full rounded-2xl border border-primary/10 px-5 py-3.5 bg-surface text-sm appearance-none focus:outline-none focus:bg-white transition-all duration-300"
            value={ordering} onChange={(e) => setOrdering(e.target.value)}>
            <option value="-created_at">Latest Editions</option>
            <option value="calories">Energy Content Low-High</option>
            <option value="-calories">Energy Content High-Low</option>
            <option value="-average_rating">Highest Resonance</option>
          </select>
        </div>

        <button onClick={apply}
          className="btn-primary w-full py-4 text-[10px] uppercase tracking-[0.3em] shadow-rose mt-4 group">
          Enact Protocol
          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}
