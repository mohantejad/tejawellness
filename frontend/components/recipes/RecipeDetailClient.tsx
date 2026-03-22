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
import {
  Heart,
  Bookmark,
  Share2,
  Star,
  Clock,
  Users,
  Droplets,
  Sparkles,
  ChevronLeft,
  MessageSquare,
  Zap,
  Leaf
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

function CommentThread({ items }: { items: RecipeComment[] }) {
  if (!items || items.length === 0) return null;
  return (
    <div className="space-y-6">
      {items.map((c) => (
        <div key={c.id} className="group">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary uppercase">
              {c.user?.[0] || 'U'}
            </div>
            <div className="font-bold text-xs text-fg">{c.user}</div>
          </div>
          <div className="text-sm text-mutedForeground leading-relaxed pl-11">{c.text}</div>
          {c.replies && c.replies.length > 0 && (
            <div className="mt-4 ml-11 border-l border-border/50 pl-6">
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
    try {
      const res = await toggleRecipeLike(recipe.id);
      setIsLiked(res.liked);
      setLikeCount(res.like_count);
      if (res.liked) toast.success("Added to your favorites");
    } catch {
      toast.error("Sign in to like this ritual");
    }
  }

  async function handleSave() {
    try {
      const res = await toggleRecipeSave(recipe.id);
      setIsSaved(res.saved);
      setSaveCount(res.save_count);
      if (res.saved) toast.success("Saved to your ritual library");
    } catch {
      toast.error("Sign in to save this ritual");
    }
  }

  async function handleReview() {
    try {
      const newReview = await createRecipeReview(recipe.id, { rating });
      const filtered = reviews.filter((r) => r.user !== newReview.user);
      setReviews([newReview, ...filtered]);
      toast.success("Thank you for your review!");
    } catch {
      toast.error("You have already reviewed this ritual");
    }
  }

  async function handleComment() {
    if (!commentText.trim()) return;
    try {
      const newComment = await createRecipeComment(recipe.id, { text: commentText });
      setComments([newComment, ...comments]);
      setCommentText("");
      toast.success("Comment posted");
    } catch {
      toast.error("Sign in to join the conversation");
    }
  }

  async function handleShare() {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: recipe.title, url });
      return;
    }
    await navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard");
  }

  const avgRating = recipe.average_rating ?? 0;

  return (
    <div className="container-page py-12 animate-in fade-in duration-1000">
      {/* Editorial Header */}
      <section className="mb-12 space-y-8">
        <Link href="/recipes" className="inline-flex items-center gap-2 text-xs font-bold text-mutedForeground uppercase tracking-[0.2em] hover:text-primary transition-colors">
          <ChevronLeft size={14} />
          Back to Recipes
        </Link>

        <div className="flex flex-col md:flex-row items-start justify-between gap-10">
          <div className="max-w-3xl space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold text-primary uppercase tracking-[0.4em]">Recipe Details</span>
              <div className="h-px w-8 bg-primary/30" />
              <div className="flex items-center gap-1 text-accent">
                <Star size={12} fill="currentColor" />
                <span className="text-[10px] font-bold tracking-widest">{avgRating.toFixed(1)}</span>
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-fg tracking-tight leading-tight">
              {recipe.title}
            </h1>
            <p className="text-xl text-mutedForeground font-serif italic leading-relaxed">
              &quot;{recipe.description}&quot;
            </p>
          </div>

          <div className="flex md:flex-col gap-3 shrink-0">
            <button onClick={handleLike} className={`h-14 w-14 rounded-full border flex items-center justify-center transition-all duration-300 ${isLiked ? 'bg-primary text-white border-primary shadow-rose' : 'border-border hover:border-primary hover:text-primary'}`}>
              <Heart size={20} fill={isLiked ? "currentColor" : "none"} />
            </button>
            <button onClick={handleSave} className={`h-14 w-14 rounded-full border flex items-center justify-center transition-all duration-300 ${isSaved ? 'bg-accent text-white border-accent shadow-rose' : 'border-border hover:border-accent hover:text-accent'}`}>
              <Bookmark size={20} fill={isSaved ? "currentColor" : "none"} />
            </button>
            <button onClick={handleShare} className="h-14 w-14 rounded-full border border-border flex items-center justify-center hover:bg-fg hover:text-white hover:border-fg transition-all duration-300">
              <Share2 size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* Hero Image & Quick Info */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
        <div className="lg:col-span-8 space-y-12">
          {image ? (
            <div className="relative h-[25rem] md:h-[40rem] rounded-[3rem] overflow-hidden shadow-rose-lg transform-gpu">
              <Image
                src={image}
                alt={recipe.title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          ) : (
            <div className="h-[30rem] rounded-[3rem] bg-muted/20 flex items-center justify-center border-2 border-dashed border-border/50">
              <Sparkles size={48} className="text-muted-foreground/20" />
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="card-soft p-6 flex flex-col items-center text-center gap-2 border-none bg-surface/50">
              <Clock size={20} className="text-primary/60" />
              <span className="text-[10px] font-bold text-mutedForeground uppercase tracking-widest">Time</span>
              <span className="text-sm font-bold text-fg">25 mins</span>
            </div>
            <div className="card-soft p-6 flex flex-col items-center text-center gap-2 border-none bg-surface/50">
              <Users size={20} className="text-primary/60" />
              <span className="text-[10px] font-bold text-mutedForeground uppercase tracking-widest">Serves</span>
              <span className="text-sm font-bold text-fg">{recipe.servings || 2}</span>
            </div>
            <div className="card-soft p-6 flex flex-col items-center text-center gap-2 border-none bg-surface/50">
              <Leaf size={20} className="text-primary/60" />
              <span className="text-[10px] font-bold text-mutedForeground uppercase tracking-widest">Type</span>
              <span className="text-sm font-bold text-fg">{recipe.meal_type || 'Healthy'}</span>
            </div>
            <div className="card-soft p-6 flex flex-col items-center text-center gap-2 border-none bg-surface/50">
              <Sparkles size={20} className="text-primary/60" />
              <span className="text-[10px] font-bold text-mutedForeground uppercase tracking-widest">Goal</span>
              <span className="text-sm font-bold text-fg">Skin Glow</span>
            </div>
          </div>

          <div className="space-y-10">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <h2 className="text-3xl font-serif font-bold text-fg">Method</h2>
                <div className="h-px grow bg-border/50" />
              </div>
              {recipe.instructions ? (
                <ol className="space-y-8">
                  {recipe.instructions
                    .split(/\n+|(?=\d+\.)/)
                    .map((s) => s.trim())
                    .filter(Boolean)
                    .map((step, idx) => (
                      <li key={idx} className="flex gap-6 group">
                        <span className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/5 border border-primary/10 flex items-center justify-center text-xs font-bold text-primary transition-all group-hover:bg-primary group-hover:text-white">
                          {idx + 1}
                        </span>
                        <div className="space-y-2 pt-1 border-b border-border/30 pb-6 w-full">
                          <p className="text-mutedForeground leading-relaxed text-lg">
                            {step.replace(/^\d+\.\s*/, "")}
                          </p>
                        </div>
                      </li>
                    ))}
                </ol>
              ) : (
                <p className="text-mutedForeground italic">No instructions provided for this recipe.</p>
              )}
            </div>

            {/* Conversation Section */}
            <div className="space-y-8 pt-12 border-t border-border/50">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-serif font-bold text-fg">Community Conversation</h3>
                <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-widest">
                  <MessageSquare size={16} />
                  {comments.length}
                </div>
              </div>

              <div className="card-soft p-8 bg-surface/30 border-none">
                <textarea
                  className="w-full bg-white/50 border border-border/50 rounded-2xl p-6 text-sm focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all min-h-[120px]"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Join the conversation..."
                />
                <div className="flex justify-end mt-4">
                  <button
                    onClick={handleComment}
                    className="btn-primary py-3 px-8 text-[10px] uppercase tracking-[0.2em]"
                  >
                    Post Thought
                  </button>
                </div>
              </div>

              {loadingComments ? (
                <div className="flex items-center justify-center py-10 opacity-50">
                  <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <div className="space-y-10 pl-4">
                  <CommentThread items={comments} />
                </div>
              )}
            </div>
          </div>
        </div>

        <aside className="lg:col-span-4 space-y-12">
          {/* Nutrient Profile */}
          <div className="card-soft p-10 bg-white shadow-rose-lg border-none relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 -mr-4 -mt-4 transition-transform group-hover:rotate-12 duration-700">
              <Droplets size={80} className="text-primary" />
            </div>

            <h3 className="text-[10px] font-bold text-primary uppercase tracking-[0.4em] mb-6">Nutrient Profile</h3>

            <div className="space-y-8 relative z-10">
              <div>
                <span className="text-5xl font-serif font-bold text-fg">{recipe.calories ?? 0}</span>
                <span className="text-xs font-bold text-mutedForeground uppercase tracking-widest ml-3">kcal</span>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                    <span>Protein</span>
                    <span className="text-fg">{recipe.protein ?? 0}g</span>
                  </div>
                  <div className="h-1 w-full bg-muted/30 rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${Math.min((recipe.protein || 0) * 2, 100)}%` }} />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                    <span>Carbs</span>
                    <span className="text-fg">{recipe.carbs ?? 0}g</span>
                  </div>
                  <div className="h-1 w-full bg-muted/30 rounded-full overflow-hidden">
                    <div className="h-full bg-accent" style={{ width: `${Math.min((recipe.carbs || 0) * 2, 100)}%` }} />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                    <span>Healthy Fat</span>
                    <span className="text-fg">{recipe.fat ?? 0}g</span>
                  </div>
                  <div className="h-1 w-full bg-muted/30 rounded-full overflow-hidden">
                    <div className="h-full bg-fg/40" style={{ width: `${Math.min((recipe.fat || 0) * 2, 100)}%` }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Nourishing Elements */}
          <div className="card-soft p-10 bg-surface/50 border-none">
            <h3 className="text-[10px] font-bold text-primary uppercase tracking-[0.4em] mb-8">Nourishing Elements</h3>
            <ul className="space-y-5">
              {recipe.recipe_ingredients?.map((ri) => (
                <li key={ri.id} className="flex items-start gap-4 group">
                  <div className="h-2 w-2 rounded-full bg-primary/40 mt-1.5 group-hover:scale-150 transition-transform group-hover:bg-primary" />
                  <div className="flex flex-col">
                    <Link href={`/ingredients/${ri.ingredient.id}`} className="text-sm font-bold text-fg hover:text-primary transition-colors">
                      {ri.ingredient.name}
                    </Link>
                    {ri.grams && (
                      <span className="text-[10px] text-mutedForeground uppercase tracking-widest mt-1">{ri.grams} grams</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Rate & Review */}
          <div className="card-soft p-10 bg-white border border-border/50 shadow-soft">
            <h3 className="text-[10px] font-bold text-fg uppercase tracking-[0.4em] mb-6 text-center">Enrich the Community</h3>
            <p className="text-xs text-mutedForeground text-center leading-relaxed mb-8">Your feedback helps refine the recipe for other users.</p>

            <div className="flex justify-center gap-2 mb-8">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  onClick={() => setRating(s)}
                  className={`transition-all duration-300 ${rating >= s ? 'text-accent scale-110' : 'text-muted/30 hover:text-accent/40'}`}
                >
                  <Star size={24} fill={rating >= s ? "currentColor" : "none"} strokeWidth={1.5} />
                </button>
              ))}
            </div>

            <button
              onClick={handleReview}
              className="w-full btn-primary py-4 px-8 text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-3 group"
            >
              <Zap size={14} className="group-hover:animate-pulse" />
              Submit Review
            </button>
          </div>
        </aside>
      </section>
    </div>
  );
}
