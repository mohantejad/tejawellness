import type { Product } from '@/types/products';
import ProductCard from './ProductCard';

type Props = {
  products: Product[];
};

export default function ProductListServer({ products }: Props) {
  if (!products.length) {
    return <div className="text-mutedForeground">No products found.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
