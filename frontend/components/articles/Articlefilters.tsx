"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function ArticleFilters() {
  const router = useRouter();
  const sp = useSearchParams();

  const [search, setSearch] = useState(sp.get("search") ?? "");
  const [ordering, setOrdering] = useState(sp.get("ordering") ?? "-created_at");

  function apply() {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (ordering) params.set("ordering", ordering);
    router.push(`?${params.toString()}`);
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      <input className="rounded-xl border border-border px-3 py-2"
        value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search" />
      <select className="rounded-xl border border-border px-3 py-2"
        value={ordering} onChange={(e) => setOrdering(e.target.value)}>
        <option value="-created_at">Newest</option>
        <option value="-average_rating">Rating</option>
      </select>
      <button onClick={apply}
        className="rounded-xl bg-primary text-primaryForeground py-2">
        Apply
      </button>
    </div>
  );
}
