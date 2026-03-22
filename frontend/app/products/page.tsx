import { fetchProducts } from "@/api/products";
import ProductCard from "@/components/products/ProductCard";
import { ShoppingBag } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const data = await fetchProducts();
  const products = data.results || [];

  return (
    <main className="container-page py-20 animate-in fade-in duration-1000">
      <header className="mb-20 space-y-6">
        <div className="flex items-center gap-3 text-accent">
          <ShoppingBag size={24} />
          <h2 className="text-[10px] font-bold uppercase tracking-[0.5em]">The Apothecary</h2>
        </div>
        <h1 className="text-6xl md:text-8xl font-serif font-bold text-fg tracking-tight leading-none">
          Curated <span className="text-accent italic">Essentials</span>
        </h1>
        <p className="text-xl text-mutedForeground max-w-2xl font-serif italic">
          Science-backed supplements and skin-care essentials, vetted for bioavailability and botanical integrity.
        </p>
      </header>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.map((product: any) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </main>
  );
}
