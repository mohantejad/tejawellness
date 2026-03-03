"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

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
    <div className="rounded-2xl border border-border bg-card p-4 shadow-soft space-y-4">
      <div className="text-sm font-semibold">Filters</div>
      <div className="space-y-3">
        <input className="rounded-xl border border-border px-3 py-2"
          value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search" />
        <input className="rounded-xl border border-border px-3 py-2"
          value={minPrice} onChange={(e) => setMinPrice(e.target.value)} placeholder="Min price" />
        <input className="rounded-xl border border-border px-3 py-2"
          value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} placeholder="Max price" />
        <select className="rounded-xl border border-border px-3 py-2"
          value={ordering} onChange={(e) => setOrdering(e.target.value)}>
          <option value="-created_at">Newest</option>
          <option value="price">Price ↑</option>
          <option value="-price">Price ↓</option>
        </select>
        <label className="flex items-center gap-2 text-sm text-mutedForeground">
          <input type="checkbox" checked={inStock} onChange={(e) => setInStock(e.target.checked)} />
          In stock
        </label>
        <button onClick={apply}
          className="rounded-xl bg-primary text-primaryForeground py-2 w-full">
          Apply
        </button>
      </div>
    </div>
  );
}
