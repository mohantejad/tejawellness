"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { fetchRecommendedGoals } from "@/api/recommendations";
import { fetchGoals } from "@/api/goals";
import { useAppSelector } from "@/redux/hooks";
import type { Goal } from "@/types/goals";
import Image from "next/image";

const GOAL_SECTIONS = [
  { key: "ingredients", label: "Ingredients", desc: "Key foods and nutrients." },
  { key: "recipes", label: "Recipes", desc: "Healthy meals for this goal." },
  { key: "meal-plans", label: "Meal Plans", desc: "Structured plans for this goal." },
  { key: "products", label: "Products", desc: "Supplements and essentials." },
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
      className="rounded-2xl border border-border bg-card overflow-hidden hover:-translate-y-1 transition"
    >
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={title}
          width={600}
          height={300}
          className="h-28 w-full object-cover"
        />
      ) : (
        <div className="h-28 bg-muted" />
      )}
      <div className="p-5">
        <div className="text-sm text-mutedForeground">{label}</div>
        <div className="text-xl font-semibold mt-2">{title}</div>
        <div className="text-sm text-mutedForeground mt-2">{desc}</div>
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
  const PRIORITY_SLUGS = [
    "skin-care",
    "hair-care",
    "weight-loss",
    "lean-body-recomposition",
    "gut-health",
    "stress-relief",
    "better-sleep",
    "anti-inflammation",
    "hormone-balance",
    "immunity",
    "energy-boost",
    "healthy-aging-longevity",
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
        setOrderedGoals(merged);
      })
      .catch(() => setOrderedGoals(prioritizeGoals(goals)));
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
      setOrderedGoals((prev) => [...prev, ...nextGoals]);
      setPage(nextPage);
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <section className="space-y-10">
      {list.map((goal) => {
        return (
          <div key={goal.id}>
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-2xl font-semibold">{goal.name}</h2>
                <p className="text-sm text-mutedForeground">{goal.description}</p>
              </div>
              <Link href={`/goals/${goal.slug}/recipes`} className="text-sm text-primary">
                View all
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                    title={`${goal.name} ${s.label}`}
                    desc={s.desc}
                    imageUrl={imageUrl || fallback}
                  />
                );
              })}
            </div>
          </div>
        );
      })}

      {hasMore && (
        <div className="flex justify-center">
          <button
            onClick={loadMore}
            className="rounded-full border border-border px-6 py-2 text-sm hover:bg-muted transition"
            disabled={loadingMore}
          >
            {loadingMore ? "Loading..." : "Load more"}
          </button>
        </div>
      )}
    </section>
  );
}
