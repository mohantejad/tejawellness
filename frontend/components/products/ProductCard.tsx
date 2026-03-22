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
import { Heart, Star, Sparkles } from "lucide-react";

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
      toast.error("Sign in to like this selection");
      router.push("/auth/login");
      return;
    }
    const res = await toggleProductLike(product.id);
    setLiked(res.liked);
    // setLikes(res.like_count); // Removing since unused
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
      className="card-soft group overflow-hidden hover:-translate-y-2 transition-all duration-500 flex flex-col h-full bg-white shadow-rose border-none"
    >
      <div className="relative h-56 w-full overflow-hidden bg-muted/10">
        {image ? (
          <Image
            src={image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-1000 group-hover:scale-110"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center opacity-20">
            <Sparkles size={32} className="text-primary" />
          </div>
        )}
        <div className="absolute top-4 left-4">
          <span className="badge-pill bg-white/90 backdrop-blur-md border-none shadow-sm uppercase tracking-[0.2em] text-[8px] font-bold text-primary px-3 py-1.5">
            Ritual Essential
          </span>
        </div>

        <button
          onClick={onLike}
          className={`absolute top-4 right-4 h-10 w-10 rounded-full border flex items-center justify-center transition-all duration-300 backdrop-blur-md ${liked ? 'bg-primary text-white border-primary shadow-rose' : 'bg-white/80 border-transparent hover:bg-white hover:text-primary text-fg/40'}`}
        >
          <Heart size={16} fill={liked ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="p-7 flex flex-col flex-grow relative">
        {/* Subtle background icon/pattern */}
        <div className="absolute bottom-0 right-0 p-4 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity duration-700">
          <div className="h-10 w-10 rounded-full border border-primary" />
        </div>

        <h3 className="text-xl font-serif font-bold text-fg leading-tight group-hover:text-primary transition-colors duration-300">
          {product.name}
        </h3>

        <div className="mt-3 text-lg font-bold text-primary font-serif">
          ${price}
        </div>

        <div className="mt-auto pt-8 flex items-center justify-between border-t border-border/40">
          <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-bold text-mutedForeground">
            <Star size={12} className="text-accent" fill="currentColor" />
            <span className="text-fg">{product.average_rating ?? 0}</span>
            <span className="opacity-40 ml-1">({product.rating_count ?? 0})</span>
          </div>

          <div className="flex items-center gap-2 text-[9px] font-bold text-primary uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 translate-x-1 group-hover:translate-x-0 transition-all duration-500">
            View Ritual
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}
