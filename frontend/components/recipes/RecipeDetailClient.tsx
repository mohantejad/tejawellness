"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import type { Recipe, RecipeComment, RecipeReview } from "@/types/recipes";
import {
  toggleRecipeLike,
  toggleRecipeSave,
  createRecipeReview,
  fetchRecipeComments,
  createRecipeComment,
} from "@/api/recipes";
import { API_BASE } from "@/api/base";

function CommentThread({ items }: { items: RecipeComment[] }) {
  if (!items || items.length === 0) return null;
  return (
    <div className="space-y-3">
      {items.map((c) => (
        <div key={c.id} className="text-sm text-mutedForeground">
          <div className="font-medium text-foreground">{c.user}</div>
          <div>{c.text}</div>
          {c.replies && c.replies.length > 0 && (
            <div className="mt-2 ml-4 border-l border-border pl-3">
              <CommentThread items={c.replies} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function RecipeDetailClient({ recipe }: { recipe: Recipe }) {
  const [likeCount, setLikeCount] = useState(recipe.like_count ?? 0);
  const [saveCount, setSaveCount] = useState(recipe.save_count ?? 0);
  const [isLiked, setIsLiked] = useState(recipe.is_liked ?? false);
  const [isSaved, setIsSaved] = useState(recipe.is_saved ?? false);

  const [reviews, setReviews] = useState<RecipeReview[]>(recipe.reviews ?? []);
  const [rating, setRating] = useState(5);

  const [comments, setComments] = useState<RecipeComment[]>([]);
  const [commentText, setCommentText] = useState("");
  const [loadingComments, setLoadingComments] = useState(false);

  const rawImage = recipe.primary_image || recipe.media?.[0]?.image_url;
  const image =
    rawImage && rawImage.startsWith("http") ? rawImage : rawImage ? `${API_BASE}${rawImage}` : undefined;

  useEffect(() => {
    setLoadingComments(true);
    fetchRecipeComments(recipe.id)
      .then((data) => {
        const list = Array.isArray(data) ? data : data?.results || [];
        setComments(list);
      })
      .catch(() => setComments([]))
      .finally(() => setLoadingComments(false));
  }, [recipe.id]);

  async function handleLike() {
    const res = await toggleRecipeLike(recipe.id);
    setIsLiked(res.liked);
    setLikeCount(res.like_count);
  }

  async function handleSave() {
    const res = await toggleRecipeSave(recipe.id);
    setIsSaved(res.saved);
    setSaveCount(res.save_count);
  }

  async function handleReview() {
    const newReview = await createRecipeReview(recipe.id, { rating });
    const filtered = reviews.filter((r) => r.user !== newReview.user);
    setReviews([newReview, ...filtered]);
  }

  async function handleComment() {
    if (!commentText.trim()) return;
    const newComment = await createRecipeComment(recipe.id, { text: commentText });
    setComments([newComment, ...comments]);
    setCommentText("");
  }

  async function handleShare() {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: recipe.title, url });
      return;
    }
    await navigator.clipboard.writeText(url);
  }

  const avgRating = useMemo(() => recipe.average_rating ?? 0, [recipe.average_rating]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <section className="lg:col-span-7 space-y-6">
        {image ? (
          <Image
            src={image}
            alt={recipe.title}
            width={1200}
            height={800}
            className="rounded-3xl object-cover w-full h-96"
          />
        ) : (
          <div className="h-96 rounded-3xl bg-muted flex items-center justify-center">
            Recipe
          </div>
        )}

        <div>
          <h1 className="text-4xl font-bold">{recipe.title}</h1>
          <p className="text-mutedForeground mt-2">{recipe.description}</p>
          <div className="mt-3 text-sm text-mutedForeground">
            ⭐ {avgRating} ({recipe.rating_count ?? 0})
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
          <h2 className="font-semibold mb-2">Ingredients</h2>
          <ul className="space-y-1 text-sm text-mutedForeground">
            {recipe.recipe_ingredients?.map((ri) => (
              <li key={ri.id}>
                • {ri.ingredient.name}
                {ri.grams ? ` (${ri.grams} g)` : ""}
              </li>
            ))}
          </ul>
        </div>

        {recipe.instructions && (
          <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
            <h2 className="font-semibold mb-2">Instructions</h2>
            <ol className="list-decimal pl-5 space-y-2 text-sm text-mutedForeground">
              {recipe.instructions
                .split(/\n+|(?=\d+\.)/)
                .map((s) => s.trim())
                .filter(Boolean)
                .map((step, idx) => (
                  <li key={idx}>{step.replace(/^\d+\.\s*/, "")}</li>
                ))}
            </ol>
          </div>
        )}

        <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
          <h3 className="font-semibold mb-2">Comments</h3>
          {loadingComments ? (
            <div className="text-sm text-mutedForeground">Loading comments...</div>
          ) : comments.length === 0 ? (
            <div className="text-sm text-mutedForeground">No comments yet.</div>
          ) : (
            <CommentThread items={comments} />
          )}

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
          <div className="text-2xl font-bold">
            {recipe.calories ?? 0} kcal
          </div>
          <div className="text-sm text-mutedForeground">
            Protein {recipe.protein ?? 0}g · Carbs {recipe.carbs ?? 0}g · Fat{" "}
            {recipe.fat ?? 0}g
          </div>

          <button
            onClick={handleLike}
            className="mt-4 w-full rounded-xl bg-primary text-primaryForeground py-2"
          >
            {isLiked ? "Unlike" : "Like"} · {likeCount}
          </button>
          <button
            onClick={handleSave}
            className="mt-2 w-full rounded-xl border border-border py-2"
          >
            {isSaved ? "Saved" : "Save"} · {saveCount}
          </button>
          <button
            onClick={handleShare}
            className="mt-2 w-full rounded-xl border border-border py-2"
          >
            Share
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
              <option key={r} value={r}>
                {r} Stars
              </option>
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
