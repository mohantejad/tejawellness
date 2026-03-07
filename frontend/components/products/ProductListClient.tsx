"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { fetchProductsByGoal } from "@/api/products";
import ProductCard from "@/components/products/ProductCard";
import type { Product } from "@/types/products";

export default function ProductListClient({ slug }: { slug: string }) {
  const [products, setProducts] = useState<Product[]>([]);
  const sp = useSearchParams();

  useEffect(() => {
    const filters = {
      search: sp.get("search") ?? undefined,
      min_price: sp.get("min_price") ?? undefined,
      max_price: sp.get("max_price") ?? undefined,
      in_stock: sp.get("in_stock") === "true" ? true : undefined,
      ordering: sp.get("ordering") ?? undefined,
    };
    fetchProductsByGoal(slug, filters).then(res => setProducts(res.results || [])).catch(() => setProducts([]));
  }, [slug, sp]);

  if (products.length === 0) {
    return <div className="text-mutedForeground">No products found for this goal.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
