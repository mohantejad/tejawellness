"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { fetchRecommendedGoals } from "@/api/recommendations";
import { fetchGoals } from "@/api/goals";
import { useAppSelector } from "@/redux/hooks";
import type { Goal } from "@/types/goals";
import Image from "next/image";
import { ChevronDown } from "lucide-react";

const GOAL_SECTIONS = [
  { key: "recipes", label: "Recipes", desc: "Nourishing daily recipes" },
  { key: "products", label: "Products", desc: "Curated supplement picks" },
  { key: "ingredients", label: "Ingredients", desc: "Nutrient-dense foundations" },
  { key: "meal-plans", label: "Meal Plan", desc: "Structured wellness paths" },
];

function GoalCard({
  href,
  label,
  title,
  desc,
  imageUrl,
}: {
  href: string;
  label: string;
  title: string;
  desc: string;
  imageUrl?: string;
}) {
  return (
    <Link
      href={href}
      className="card-soft group overflow-hidden hover:-translate-y-1.5 transition-all duration-500 flex flex-col h-full bg-white shadow-rose border-none"
    >
      <div className="relative h-48 w-full overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover transition-transform duration-1000 group-hover:scale-110"
          />
        ) : (
          <div className="h-full w-full bg-muted/20 flex items-center justify-center">
            <div className="h-px w-8 bg-primary/20" />
          </div>
        )}
        <div className="absolute top-4 left-4">
          <span className="badge-pill bg-white/90 backdrop-blur-md border-none shadow-sm text-[9px] px-3 py-1.5 uppercase tracking-[0.2em] font-bold text-primary">
            {label}
          </span>
        </div>
      </div>
      <div className="p-8 flex flex-col flex-grow relative">
        {/* Subtle background icon/pattern */}
        <div className="absolute bottom-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-700">
          <div className="h-12 w-12 rounded-full border border-primary" />
        </div>

        <h3 className="text-xl font-serif font-bold text-fg leading-tight group-hover:text-primary transition-colors duration-300">
          {title}
        </h3>
        <p className="text-sm text-mutedForeground mt-4 h-10 line-clamp-2 leading-relaxed italic font-serif">
          "{desc}"
        </p>

        <div className="mt-6 pt-4 border-t border-border/40 flex items-center justify-between text-[10px] font-bold text-primary uppercase tracking-[0.3em] group-hover:translate-x-1 transition-all duration-500">
          Explore
          <div className="h-8 w-8 rounded-full bg-surface flex items-center justify-center text-fg group-hover:bg-primary group-hover:text-white transition-all duration-500">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function GoalsSection({
  goals,
  totalCount,
  initialPage,
}: {
  goals: Goal[];
  totalCount: number;
  initialPage: number;
}) {
  const { user } = useAppSelector((s) => s.auth);
  // Prioritize Skin and Hair above all else
  const PRIORITY_SLUGS = [
    "skin-care",
    "hair-care",
    "nail-health",
    "detox-clean-living",
    "anti-inflammation",
    "gut-health",
    "immunity",
  ];

  const prioritizeGoals = (list: Goal[]) => {
    const rank = new Map(PRIORITY_SLUGS.map((s, i) => [s, i]));
    return [...list].sort((a, b) => {
      const ra = rank.has(a.slug) ? rank.get(a.slug)! : 999;
      const rb = rank.has(b.slug) ? rank.get(b.slug)! : 999;
      if (ra !== rb) return ra - rb;
      return a.name.localeCompare(b.name);
    });
  };

  const [orderedGoals, setOrderedGoals] = useState<Goal[]>(prioritizeGoals(goals));
  const [page, setPage] = useState(initialPage);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    if (!user) return;
    fetchRecommendedGoals()
      .then((recs) => {
        const recIds = new Set(recs.map((g) => g.id));
        const remaining = goals.filter((g) => !recIds.has(g.id));
        const merged = [
          ...recs.map((r) => goals.find((g) => g.id === r.id)).filter(Boolean) as Goal[],
          ...remaining,
        ];
        const filtered = merged.filter(g => goals.some(orig => orig.id === g.id));
        setOrderedGoals(prioritizeGoals(filtered));
      })
      .catch(() => setOrderedGoals(prioritizeGoals(goals)));
  }, [user, goals]);

  const list = useMemo(() => orderedGoals, [orderedGoals]);
  const hasMore = list.length < totalCount;

  const loadMore = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const data = await fetchGoals(nextPage);
      const nextGoals = data.results || [];
      setOrderedGoals((prev) => prioritizeGoals([...prev, ...nextGoals]));
      setPage(nextPage);
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <section className="space-y-32 py-12">
      {list.map((goal, idx) => {
        return (
          <div key={goal.id} className="animate-in fade-in slide-in-from-bottom-8 duration-1000" style={{ animationDelay: `${idx * 150}ms` }}>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-12 border-b border-border/50 pb-10">
              <div className="max-w-3xl space-y-4">
                <h2 className="text-4xl md:text-5xl font-serif font-bold text-fg tracking-tight">{goal.name}</h2>
                <p className="text-lg text-mutedForeground leading-relaxed font-serif italic max-w-2xl">
                  "{goal.description}"
                </p>
              </div>

              <Link href={`/goals/${goal.slug}`} className="group flex items-center gap-4 text-xs font-bold text-fg uppercase tracking-[0.3em] hover:text-primary transition-colors">
                View Details
                <div className="h-12 w-12 rounded-full border border-border flex items-center justify-center group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-500 shadow-rose">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {GOAL_SECTIONS.map((s) => {
                const imageUrl =
                  s.key === "ingredients"
                    ? goal.image_workouts
                    : s.key === "recipes"
                      ? goal.image_recipes
                      : s.key === "meal-plans"
                        ? goal.image_recipes
                        : s.key === "products"
                          ? goal.image_products
                          : goal.image_articles;

                const fallback =
                  goal.image_recipes ||
                  goal.image_products ||
                  goal.image_workouts ||
                  goal.image_articles;

                return (
                  <GoalCard
                    key={s.key}
                    href={`/goals/${goal.slug}/${s.key}`}
                    label={s.label}
                    title={s.label}
                    desc={`Curated ${s.label.toLowerCase()} tailored for ${goal.name.toLowerCase()}.`}
                    imageUrl={imageUrl || fallback}
                  />
                );
              })}
            </div>
          </div>
        );
      })}

      {hasMore && (
        <div className="flex justify-center pt-12">
          <button
            onClick={loadMore}
            className="group flex flex-col items-center gap-4 text-[10px] font-bold uppercase tracking-[0.4em] text-mutedForeground hover:text-primary transition-colors"
            disabled={loadingMore}
          >
            {loadingMore ? (
              <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                Discover More
                <div className="h-10 w-10 rounded-full border border-border flex items-center justify-center group-hover:border-primary group-hover:text-primary transition-all duration-500">
                  <ChevronDown size={18} />
                </div>
              </>
            )}
          </button>
        </div>
      )}
    </section>
  );
}
