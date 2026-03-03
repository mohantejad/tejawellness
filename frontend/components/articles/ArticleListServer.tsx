import type { Article } from '@/types/articles';
import ArticleCard from './ArticleCard';

type Props = {
  articles: Article[];
};

export default function ArticleListServer({ articles }: Props) {
  if (!articles.length) {
    return <div className="text-mutedForeground">No articles found.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {articles.map((a) => (
        <ArticleCard key={a.id} article={a} />
      ))}
    </div>
  );
}
