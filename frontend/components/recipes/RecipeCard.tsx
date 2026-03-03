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
      className="group block rounded-2xl border border-border bg-card shadow-soft overflow-hidden hover:-translate-y-1 hover:shadow-lg transition"
    >
      {image ? (
        <Image
          src={image}
          alt={recipe.title}
          width={900}
          height={600}
          className="h-40 w-full object-cover"
        />
      ) : (
        <div className="h-40 bg-linear-to-br from-primary/15 via-accent/10 to-transparent flex items-end p-4">
          <span className="text-xs px-2 py-1 rounded-full bg-white/80 border border-border text-mutedForeground">
            Recipe
          </span>
        </div>
      )}

      <div className="p-4 space-y-1">
        <div className="font-semibold group-hover:text-primary transition">
          {recipe.title}
        </div>
        <div className="text-sm text-mutedForeground">
          {recipe.calories ?? 0} kcal · {recipe.protein ?? 0}g protein
        </div>

        <div className="flex items-center justify-between text-xs text-mutedForeground mt-2">
          <div className="flex items-center gap-4">
            <span>⭐ {recipe.average_rating ?? 0} ({recipe.rating_count ?? 0})</span>
          </div>
          <button
            onClick={onLike}
            className="flex items-center gap-1 hover:text-primary transition"
          >
            <span>{liked ? "❤️" : "🤍"}</span>
            <span>{likes}</span>
          </button>
        </div>
      </div>
    </Link>
  );
}
