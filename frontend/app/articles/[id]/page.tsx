import { fetchArticleById } from "@/api/articles";
import ArticleDetailClient from "@/components/articles/ArticleDetailClient";

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const article = await fetchArticleById(id);

  return <ArticleDetailClient article={article} />;
}
