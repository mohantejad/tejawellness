"use client";

import { useEffect, useState } from "react";
import { fetchArticlesByGoal } from "@/api/articles";
import ArticleCard from "@/components/articles/ArticleCard";
import type { Article } from "@/types/articles";

export default function ArticleListClient({ slug }: { slug: string }) {
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    fetchArticlesByGoal(slug).then(setArticles).catch(() => setArticles([]));
  }, [slug]);

  if (articles.length === 0) {
    return <div className="text-mutedForeground">No articles found for this goal.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {articles.map((a) => (
        <ArticleCard key={a.id} article={a} />
      ))}
    </div>
  );
}
