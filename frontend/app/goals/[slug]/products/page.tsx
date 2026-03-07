import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
  const title = slug.replace("-", " ");
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
    <main className="container-page py-12 space-y-12 animate-in fade-in duration-1000">
      {/* Editorial Header */}
      <div className="max-w-4xl space-y-4">
        <div className="flex items-center gap-3">
          <Link href={`/goals/${slug}`} className="text-[10px] font-bold text-primary uppercase tracking-[0.4em] hover:opacity-70 transition-opacity">
            {title} Sanctuary
          </Link>
          <div className="h-px w-8 bg-primary/30" />
          <span className="text-[10px] font-bold text-mutedForeground uppercase tracking-[0.4em]">The Apothecary</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-serif font-bold text-fg tracking-tight leading-tight capitalize">
          {title} Curation
        </h1>
        <p className="text-xl text-mutedForeground font-serif italic leading-relaxed max-w-2xl">
          "A bespoke collection of science-backed formulations and botanical elixirs, curated for {title} excellence."
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <aside className="lg:col-span-4">
          <div className="sticky top-28">
            <ProductFilters />
          </div>
        </aside>
        <section className="lg:col-span-8 space-y-10">
          {products.length === 0 ? (
            <div className="h-[40vh] flex flex-col items-center justify-center text-center space-y-4">
              <p className="text-mutedForeground font-serif italic">No apothecary products matched your refined search for {title}.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="pt-12 border-t border-primary/10 flex items-center justify-between">
              <div className="text-[10px] font-bold text-mutedForeground uppercase tracking-widest">
                Edition {currentPage} of {totalPages}
              </div>
              <div className="flex items-center gap-4">
                <a
                  className={`h-12 w-12 rounded-full border border-border flex items-center justify-center text-mutedForeground hover:border-primary hover:text-primary transition-all duration-300 ${currentPage <= 1 ? "pointer-events-none opacity-20" : ""}`}
                  href={buildPageLink(currentPage - 1)}
                >
                  <ChevronLeft size={18} />
                </a>
                <a
                  className={`h-12 w-12 rounded-full border border-border flex items-center justify-center text-mutedForeground hover:border-primary hover:text-primary transition-all duration-300 ${currentPage >= totalPages ? "pointer-events-none opacity-20" : ""}`}
                  href={buildPageLink(currentPage + 1)}
                >
                  <ChevronRight size={18} />
                </a>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
