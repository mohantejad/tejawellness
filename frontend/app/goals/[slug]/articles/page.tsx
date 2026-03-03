import ArticleListClient from "@/components/articles/ArticleListClient";


export default async function GoalArticlesPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold capitalize">{slug.replace("-", " ")} Articles</h1>
      <ArticleListClient slug={slug} />
    </div>
  );
}
