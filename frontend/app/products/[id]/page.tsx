import { fetchProductById } from "@/api/products";
import ProductDetailClient from "@/components/products/ProductDetailClient";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await fetchProductById(id);

  return <ProductDetailClient product={product} />;
}
