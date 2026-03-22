import { fetchArticles } from "@/api/articles";
import ArticleCard from "@/components/articles/ArticleCard";
import { Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ArticlesPage() {
  const articles = await fetchArticles();

  return (
    <main className="container-page py-20 animate-in fade-in duration-1000">
      <header className="mb-20 space-y-6">
        <div className="flex items-center gap-3 text-primary">
          <Sparkles size={24} className="animate-pulse" />
          <h2 className="text-[10px] font-bold uppercase tracking-[0.5em]">The Archive</h2>
        </div>
        <h1 className="text-6xl md:text-8xl font-serif font-bold text-fg tracking-tight leading-none">
          Botanical <span className="text-primary italic">Wisdom</span>
        </h1>
        <p className="text-xl text-mutedForeground max-w-2xl font-serif italic">
          Deep dives into the science of radiance, curated from our archival library of wellness insights.
        </p>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {articles.map((article: any) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </main>
  );
}
