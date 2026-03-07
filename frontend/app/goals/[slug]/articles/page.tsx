import Link from "next/link";
import ArticleListClient from "@/components/articles/ArticleListClient";

export default async function GoalArticlesPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const title = slug.replace("-", " ");

  return (
    <main className="container-page py-12 space-y-12 animate-in fade-in duration-1000">
      {/* Editorial Header */}
      <div className="max-w-4xl space-y-4">
        <div className="flex items-center gap-3">
          <Link href={`/goals/${slug}`} className="text-[10px] font-bold text-primary uppercase tracking-[0.4em] hover:opacity-70 transition-opacity">
            {title} Sanctuary
          </Link>
          <div className="h-px w-8 bg-primary/30" />
          <span className="text-[10px] font-bold text-mutedForeground uppercase tracking-[0.4em]">Wisdom Archives</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-serif font-bold text-fg tracking-tight leading-tight capitalize">
          {title} Insights
        </h1>
        <p className="text-xl text-mutedForeground font-serif italic leading-relaxed max-w-2xl">
          "Deep dives into the science and ritual of {title}, featuring expert perspectives and evidence-based protocols."
        </p>
      </div>

      <div className="pt-8">
        <ArticleListClient slug={slug} />
      </div>
    </main>
  );
}
