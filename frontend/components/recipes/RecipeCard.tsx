"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { toggleRecipeLike } from "@/api/recipes";
import { useAppSelector } from "@/redux/hooks";
import type { RecipeCardData } from "@/types/recipes";

export default function RecipeCard({ recipe }: { recipe: RecipeCardData }) {
  const router = useRouter();
  const { user } = useAppSelector((s) => s.auth);

  const [liked, setLiked] = useState(recipe.is_liked ?? false);
  const [likes, setLikes] = useState(recipe.like_count ?? 0);

  const image = recipe.media?.[0]?.image_url;

  const onLike = async (e: React.MouseEvent) => {
    e.preventDefault(); // stop Link navigation
    if (!user) {
      toast.error("Please login to like");
      router.push("/auth/login");
      return;
    }
    const res = await toggleRecipeLike(recipe.id);
    setLiked(res.liked);
    setLikes(res.like_count);
  };

  return (
    <Link
      href={`/recipes/${recipe.id}`}
      className="card-soft group overflow-hidden hover:-translate-y-1.5 transition-all duration-300 flex flex-col h-full"
    >
      <div className="relative h-48 w-full overflow-hidden">
        {image ? (
          <Image
            src={image}
            alt={recipe.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="h-full w-full bg-linear-to-br from-primary/10 via-accent/5 to-transparent flex items-center justify-center">
            <span className="text-xs font-bold text-primary/40 uppercase tracking-widest">Teja Ritual</span>
          </div>
        )}
        <div className="absolute top-3 left-3">
          <span className="badge-pill bg-white/90 backdrop-blur-sm border-none shadow-sm capitalize">
            {recipe.meal_type || 'Recipe'}
          </span>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-xl font-serif font-bold text-fg leading-snug group-hover:text-primary transition-colors">
          {recipe.title}
        </h3>

        <div className="mt-3 flex items-center gap-3 text-[10px] font-bold text-mutedForeground uppercase tracking-widest">
          <span>{recipe.calories ?? 0} kcal</span>
          <span className="h-1 w-1 rounded-full bg-border" />
          <span>{recipe.protein ?? 0}g protein</span>
        </div>

        <div className="mt-auto pt-6 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-mutedForeground">
            <span className="text-primary">★</span>
            <span className="font-bold text-fg">{recipe.average_rating ?? 0}</span>
            <span className="opacity-50">({recipe.rating_count ?? 0})</span>
          </div>

          <button
            onClick={onLike}
            className="flex items-center gap-1.5 hover:scale-110 transition-transform"
          >
            <span className="text-sm">{liked ? "❤️" : "🤍"}</span>
            <span className="text-xs font-bold text-fg">{likes}</span>
          </button>
        </div>
      </div>
    </Link>
  );
}
