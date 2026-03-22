import ProductFilters from '@/components/products/ProductFilter';
import ProductListServer from '@/components/products/ProductListServer';
import { fetchProducts } from '@/api/products';

export const dynamic = "force-dynamic";

type SearchParams = {
  page?: string;
  search?: string;
  min_price?: string;
  max_price?: string;
  in_stock?: string;
  ordering?: string;
};

export default async function ProductsPage({ searchParams }: { searchParams: SearchParams }) {
  const filters = {
    ...searchParams,
    in_stock: searchParams.in_stock === 'true' ? true : undefined,
  };
  const page = searchParams.page ? Number(searchParams.page) : 1;
  const data = await fetchProducts(filters, page);
  const products = data.results || [];
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
    return `/products?${params.toString()}`;
  };

  return (
    <main className="container-page space-y-12 py-10 animate-in fade-in duration-1000">
      <div className="max-w-3xl space-y-4">
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-bold text-primary uppercase tracking-[0.4em]">The Selection</span>
          <div className="h-px w-8 bg-primary/30" />
        </div>
        <h1 className="text-5xl md:text-7xl font-serif font-bold text-fg tracking-tight leading-tight">
          The Apothecary
        </h1>
        <p className="text-xl text-mutedForeground font-serif italic leading-relaxed max-w-2xl">
          "A curated collection of botanical essentials and science-backed supplements designed for follicular strength and dermal resilience."
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <aside className="lg:col-span-4">
          <div className="sticky top-24">
            <ProductFilters />
          </div>
        </aside>
        <section className="lg:col-span-8">
          <ProductListServer products={products} />

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
    </main>
  );
}
