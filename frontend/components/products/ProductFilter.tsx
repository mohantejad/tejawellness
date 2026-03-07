"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Search, CircleDollarSign, SortAsc, Filter, Zap } from "lucide-react";

export default function ProductFilters() {
  const router = useRouter();
  const sp = useSearchParams();

  const [search, setSearch] = useState(sp.get("search") ?? "");
  const [minPrice, setMinPrice] = useState(sp.get("min_price") ?? "");
  const [maxPrice, setMaxPrice] = useState(sp.get("max_price") ?? "");
  const [inStock, setInStock] = useState(sp.get("in_stock") === "true");
  const [ordering, setOrdering] = useState(sp.get("ordering") ?? "-created_at");

  function apply() {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (minPrice) params.set("min_price", minPrice);
    if (maxPrice) params.set("max_price", maxPrice);
    if (inStock) params.set("in_stock", "true");
    if (ordering) params.set("ordering", ordering);
    router.push(`?${params.toString()}`);
  }

  return (
    <div className="card-soft p-8 bg-surface/30 border-none space-y-8 animate-in fade-in duration-700">
      <div className="flex items-center gap-3">
        <Filter size={16} className="text-primary" />
        <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-fg">Refine Selection</h3>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-mutedForeground uppercase tracking-widest ml-1">Search Rituals</label>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-mutedForeground/40" size={16} />
            <input
              className="w-full bg-white/50 border border-border/40 rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Botanical, Skin..."
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-mutedForeground uppercase tracking-widest ml-1">Min Price</label>
            <div className="relative">
              <CircleDollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-mutedForeground/40" size={14} />
              <input
                className="w-full bg-white/50 border border-border/40 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="0"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-mutedForeground uppercase tracking-widest ml-1">Max Price</label>
            <div className="relative">
              <CircleDollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-mutedForeground/40" size={14} />
              <input
                className="w-full bg-white/50 border border-border/40 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="500"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold text-mutedForeground uppercase tracking-widest ml-1">Order By</label>
          <div className="relative">
            <SortAsc className="absolute left-4 top-1/2 -translate-y-1/2 text-mutedForeground/40" size={16} />
            <select
              className="w-full bg-white/50 border border-border/40 rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all appearance-none cursor-pointer"
              value={ordering}
              onChange={(e) => setOrdering(e.target.value)}
            >
              <option value="-created_at">Newest Additions</option>
              <option value="price">Price: Low to High</option>
              <option value="-price">Price: High to Low</option>
            </select>
          </div>
        </div>

        <label className="flex items-center gap-3 cursor-pointer group py-2">
          <input
            type="checkbox"
            className="h-5 w-5 rounded border-border/50 text-primary focus:ring-primary/20 transition-all cursor-pointer"
            checked={inStock}
            onChange={(e) => setInStock(e.target.checked)}
          />
          <span className="text-xs font-bold text-mutedForeground group-hover:text-fg transition-colors uppercase tracking-widest">Available Rituals Only</span>
        </label>

        <button
          onClick={apply}
          className="btn-primary py-4 px-8 text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-3 group w-full shadow-rose"
        >
          <Zap size={14} className="group-hover:animate-pulse" />
          Enact Selection
        </button>
      </div>
    </div>
  );
}
