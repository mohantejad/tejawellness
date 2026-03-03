"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { toggleProductLike } from "@/api/products";
import { API_BASE } from "@/api/base";
import { useAppSelector } from "@/redux/hooks";
import type { Product } from "@/types/products";

export default function ProductCard({ product }: { product: Product }) {
  const router = useRouter();
  const { user } = useAppSelector((s) => s.auth);

  const [liked, setLiked] = useState(product.is_liked ?? false);
  const [likes, setLikes] = useState(product.like_count ?? 0);

  const price =
    typeof product.price === "number"
      ? product.price.toFixed(2)
      : product.price;

  const onLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to like");
      router.push("/auth/login");
      return;
    }
    const res = await toggleProductLike(product.id);
    setLiked(res.liked);
    setLikes(res.like_count);
  };

  const rawImage = product.primary_image || product.image_url;
  const image =
    rawImage && rawImage.startsWith("http")
      ? rawImage
      : rawImage
      ? `${API_BASE}${rawImage}`
      : undefined;

  return (
    <Link
      href={`/products/${product.id}`}
      className="group block rounded-2xl border border-border bg-card shadow-soft overflow-hidden hover:-translate-y-1 hover:shadow-lg transition"
    >
      {image ? (
        <Image
          src={image}
          alt={product.name}
          width={900}
          height={600}
          className="h-40 w-full object-cover"
        />
      ) : (
        <div className="h-40 bg-muted flex items-center justify-center text-mutedForeground">
          Product
        </div>
      )}

      <div className="p-4 space-y-1">
        <div className="font-semibold group-hover:text-primary transition">
          {product.name}
        </div>
        <div className="text-sm text-mutedForeground">${price}</div>

        <div className="flex items-center justify-between text-xs text-mutedForeground mt-2">
          <span>⭐ {product.average_rating ?? 0} ({product.rating_count ?? 0})</span>
          <button onClick={onLike} className="flex items-center gap-1 hover:text-primary transition">
            <span>{liked ? "❤️" : "🤍"}</span>
            <span>{likes}</span>
          </button>
        </div>
      </div>
    </Link>
  );
}
