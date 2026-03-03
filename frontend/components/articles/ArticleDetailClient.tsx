"use client";

import { useState } from "react";
import Image from "next/image";
import type { Article, ArticleReview, ArticleComment } from "@/types/articles";
import {
  toggleArticleLike,
  fetchArticleById,
  createArticleReview,
  fetchArticleComments,
  createArticleComment,
} from "@/api/articles";

export default function ArticleDetailClient({ article }: { article: Article }) {
  const [likeCount, setLikeCount] = useState<number>(article.like_count ?? 0);
  const [isLiked, setIsLiked] = useState<boolean>(article.is_liked ?? false);
  const [avgRating, setAvgRating] = useState<number>(article.average_rating ?? 0);
  const [ratingCount, setRatingCount] = useState<number>(article.rating_count ?? 0);

  const [reviews, setReviews] = useState<ArticleReview[]>(article.reviews ?? []);
  const [rating, setRating] = useState<number>(5);

  const [comments, setComments] = useState<ArticleComment[]>([]);
  const [commentText, setCommentText] = useState<string>("");

  async function handleLike() {
    const res = await toggleArticleLike(article.id);
    setIsLiked(res.liked);
    setLikeCount(res.like_count);
  }

  async function handleReview() {
    const newReview = await createArticleReview(article.id, { rating });
    setReviews((prev) => {
      const idx = prev.findIndex((r) => r.user === newReview.user);
      if (idx === -1) return [newReview, ...prev];
      const copy = [...prev];
      copy[idx] = newReview;
      return copy;
    });
    const updated = await fetchArticleById(article.id);
    setAvgRating(updated.average_rating ?? 0);
    setRatingCount(updated.rating_count ?? 0);
  }

  async function loadComments() {
    const data = await fetchArticleComments(article.id);
    setComments(data);
  }

  async function handleComment() {
    const newComment = await createArticleComment(article.id, { text: commentText });
    setComments((prev) => [newComment, ...prev]);
    setCommentText("");
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <section className="lg:col-span-7 space-y-6">
        {article.image_url ? (
          <Image
            src={article.image_url}
            alt={article.title}
            width={1200}
            height={800}
            className="rounded-3xl object-cover w-full h-96"
          />
        ) : (
          <div className="h-96 rounded-3xl bg-muted flex items-center justify-center">
            Article
          </div>
        )}

        <div>
          <h1 className="text-4xl font-bold">{article.title}</h1>
          <p className="text-mutedForeground mt-2">{article.summary}</p>
        </div>

        <div className="prose max-w-none">
          {article.content}
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
          <h3 className="font-semibold mb-2">Comments</h3>
          <button onClick={loadComments} className="text-sm text-primary underline">
            Load Comments
          </button>
          <div className="mt-3 space-y-2 text-sm text-mutedForeground">
            {comments.map((c) => (
              <div key={c.id}>• {c.text}</div>
            ))}
          </div>

          <textarea
            className="mt-3 w-full border rounded-lg p-2"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Write a comment..."
          />
          <button
            onClick={handleComment}
            className="mt-2 w-full rounded-xl bg-primary text-primaryForeground py-2"
          >
            Post Comment
          </button>
        </div>
      </section>

      <aside className="lg:col-span-5 space-y-4">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
          <div className="text-sm text-mutedForeground">
            ⭐ {avgRating} ({ratingCount})
          </div>

          <button
            onClick={handleLike}
            className="mt-4 w-full rounded-xl bg-primary text-primaryForeground py-2"
          >
            {isLiked ? "Unlike" : "Like"} · {likeCount}
          </button>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
          <h3 className="font-semibold mb-2">Leave a Review</h3>
          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="w-full border rounded-lg p-2"
          >
            {[5, 4, 3, 2, 1].map((r) => (
              <option key={r} value={r}>{r} Stars</option>
            ))}
          </select>
          <button
            onClick={handleReview}
            className="mt-3 w-full rounded-xl bg-primary text-primaryForeground py-2"
          >
            Submit Review
          </button>
        </div>
      </aside>
    </div>
  );
}
