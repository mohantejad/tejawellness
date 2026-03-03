"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { fetchMixedRecommendations, MixedRecommendation } from "@/api/recommendations";
import { useAppSelector } from "@/redux/hooks";

export default function RecommendedRow() {
  const { user } = useAppSelector((s) => s.auth);
  const [items, setItems] = useState<MixedRecommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!user) {
      setItems([]);
      return;
    }

    let active = true;

    (async () => {
      if (active) setLoading(true);
      try {
        const data = await fetchMixedRecommendations();
        if (active) setItems(data);
      } catch {
        if (active) setItems([]);
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [user]);

  if (!user) return null;

  const scrollBy = (dir: "left" | "right") => {
    if (!scrollerRef.current) return;
    const amount = dir === "left" ? -320 : 320;
    scrollerRef.current.scrollBy({ left: amount, behavior: "smooth" });
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Recommended for you</h2>
      </div>

      {loading && <div className="text-mutedForeground">Loading recommendations…</div>}

      {!loading && items.length === 0 && (
        <div className="text-mutedForeground">No recommendations yet.</div>
      )}

      {items.length > 0 && (
        <div className="relative">
          <button
            onClick={() => scrollBy("left")}
            className="absolute -left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white border border-border shadow-sm flex items-center justify-center z-10"
            aria-label="Scroll left"
          >
            ‹
          </button>

          <div
            ref={scrollerRef}
            className="flex gap-4 overflow-x-auto scroll-smooth no-scrollbar bg-card"
          >
            {items.map((item) => (
              <Link
                key={`${item.type}-${item.id}`}
                href={item.type === "meal_plan" ? `/meal-plans/${item.id}` : `/${item.type}s/${item.id}`}
                className="card-soft p-4 min-w-60 max-w-60 hover:-translate-y-1 transition"
              >
                <div className="text-xs text-mutedForeground uppercase">{item.type}</div>
                <div className="text-lg font-semibold mt-2">{item.title}</div>
                <div className="text-sm text-mutedForeground mt-1">Goal: {item.goal}</div>
              </Link>
            ))}
          </div>

          <button
            onClick={() => scrollBy("right")}
            className="absolute -right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white border border-border shadow-sm flex items-center justify-center z-10"
            aria-label="Scroll right"
          >
            ›
          </button>
        </div>
      )}
    </section>
  );
}
