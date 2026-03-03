"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { toggleArticleLike } from "@/api/articles";
import { useAppSelector } from "@/redux/hooks";
import type { Article } from "@/types/articles";

export default function ArticleCard({ article }: { article: Article }) {
  const router = useRouter();
  const { user } = useAppSelector((s) => s.auth);

  const [liked, setLiked] = useState(article.is_liked ?? false);
  const [likes, setLikes] = useState(article.like_count ?? 0);

  const onLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to like");
      router.push("/auth/login");
      return;
    }
    const res = await toggleArticleLike(article.id);
    setLiked(res.liked);
    setLikes(res.like_count);
  };

  return (
    <Link
      href={`/articles/${article.id}`}
      className="group block rounded-2xl border border-border bg-card shadow-soft overflow-hidden hover:-translate-y-1 hover:shadow-lg transition"
    >
      {article.image_url ? (
        <Image
          src={article.image_url}
          alt={article.title}
          width={900}
          height={600}
          className="h-40 w-full object-cover"
        />
      ) : (
        <div className="h-40 bg-linear-to-br from-primary/15 via-accent/10 to-transparent flex items-end p-4">
          <span className="text-xs px-2 py-1 rounded-full bg-white/80 border border-border text-mutedForeground">
            Article
          </span>
        </div>
      )}

      <div className="p-4 space-y-1">
        <div className="font-semibold group-hover:text-primary transition">
          {article.title}
        </div>
        <div className="text-sm text-mutedForeground">
          {article.summary ?? "Wellness insights for your goals."}
        </div>

        <div className="flex items-center justify-between text-xs text-mutedForeground mt-2">
          <span>⭐ {article.average_rating ?? 0} ({article.rating_count ?? 0})</span>
          <button onClick={onLike} className="flex items-center gap-1 hover:text-primary transition">
            <span>{liked ? "❤️" : "🤍"}</span>
            <span>{likes}</span>
          </button>
        </div>
      </div>
    </Link>
  );
}
