import ProductCard from "@/components/products/ProductCard";
import ProductFilters from "@/components/products/ProductFilter";
import { fetchProductsByGoal } from "@/api/products";
import type { Product } from "@/types/products";

export default async function GoalProductsPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: {
    page?: string;
    search?: string;
    min_price?: string;
    max_price?: string;
    in_stock?: string;
    ordering?: string;
  };
}) {
  const { slug } = await params;
  const page = searchParams.page ? Number(searchParams.page) : 1;
  const filters = {
    search: searchParams.search,
    min_price: searchParams.min_price,
    max_price: searchParams.max_price,
    in_stock: searchParams.in_stock === "true" ? true : undefined,
    ordering: searchParams.ordering,
  };
  const data = await fetchProductsByGoal(slug, filters, page);
  const products: Product[] = data.results || [];
  const count = data.count || 0;
  const currentPage = page;
  const perPage = products.length || 1;
  const totalPages = Math.max(1, Math.ceil(count / perPage));

  const buildPageLink = (p: number) => {
    const params = new URLSearchParams();
    if (filters.search) params.set("search", filters.search);
    if (filters.min_price) params.set("min_price", filters.min_price);
    if (filters.max_price) params.set("max_price", filters.max_price);
    if (filters.in_stock) params.set("in_stock", "true");
    if (filters.ordering) params.set("ordering", filters.ordering);
    params.set("page", String(p));
    return `/goals/${slug}/products?${params.toString()}`;
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold capitalize">{slug.replace("-", " ")} Products</h1>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <aside className="lg:col-span-4">
          <div className="sticky top-24">
            <ProductFilters />
          </div>
        </aside>
        <section className="lg:col-span-8">
          {products.length === 0 && (
            <div className="text-mutedForeground">No products found for this goal.</div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between text-sm mt-6">
              <div className="text-mutedForeground">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex items-center gap-2">
                <a
                  className={`px-3 py-2 rounded-lg border border-border ${currentPage <= 1 ? "pointer-events-none opacity-50" : ""}`}
                  href={buildPageLink(currentPage - 1)}
                >
                  Prev
                </a>
                <a
                  className={`px-3 py-2 rounded-lg border border-border ${currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}`}
                  href={buildPageLink(currentPage + 1)}
                >
                  Next
                </a>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
