import ArticleFilters from '@/components/articles/Articlefilters';
import ArticleListServer from '@/components/articles/ArticleListServer';
import { fetchArticles } from '@/api/articles';

type SearchParams = {
  search?: string;
  ordering?: string;
};

export default async function ArticlesPage({ searchParams }: { searchParams: SearchParams }) {
  const articles = await fetchArticles(searchParams);

  return (
    <main className="container-page space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Articles</h1>
            <p className="text-sm text-mutedForeground">Wellness insights from our experts.</p>
          </div>
        </div>
        <ArticleFilters />
        <ArticleListServer articles={articles} />
      </div>
    </main>
  );
}
