"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  toggleArticleLike,
  fetchArticleById,
  createArticleReview,
  fetchArticleComments,
  createArticleComment,
} from "@/api/articles";
import type { Article, ArticleReview, ArticleComment } from "@/types/articles";
import {
  ChevronLeft,
  Heart,
  Share2,
  Star,
  Clock,
  Sparkles,
  MessageSquare,
  Bookmark
} from "lucide-react";
import { toast } from "sonner";

export default function ArticleDetailClient({ article }: { article: Article }) {
  const [likeCount, setLikeCount] = useState<number>(article.like_count ?? 0);
  const [isLiked, setIsLiked] = useState<boolean>(article.is_liked ?? false);
  const [avgRating, setAvgRating] = useState<number>(article.average_rating ?? 0);
  const [ratingCount, setRatingCount] = useState<number>(article.rating_count ?? 0);

  const [reviews, setReviews] = useState<ArticleReview[]>(article.reviews ?? []);
  const [rating, setRating] = useState<number>(5);

  const [comments, setComments] = useState<ArticleComment[]>([]);
  const [commentText, setCommentText] = useState<string>("");
  const [loadingComments, setLoadingComments] = useState(false);

  async function handleLike() {
    try {
      const res = await toggleArticleLike(article.id);
      setIsLiked(res.liked);
      setLikeCount(res.like_count);
      if (res.liked) toast.success("Added to your wisdom collection");
    } catch {
      toast.error("Sign in to save articles");
    }
  }

  async function handleReview() {
    try {
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
      toast.success("Article rated");
    } catch {
      toast.error("You've already rated this article");
    }
  }

  async function loadComments() {
    setLoadingComments(true);
    try {
      const data = await fetchArticleComments(article.id);
      setComments(data);
    } catch {
      setComments([]);
    } finally {
      setLoadingComments(false);
    }
  }

  async function handleComment() {
    if (!commentText.trim()) return;
    try {
      const newComment = await createArticleComment(article.id, { text: commentText });
      setComments((prev) => [newComment, ...prev]);
      setCommentText("");
      toast.success("Thought shared");
    } catch {
      toast.error("Sign in to share thoughts");
    }
  }

  return (
    <main className="container-page py-12 animate-in fade-in duration-1000">
      {/* Editorial Header */}
      <section className="mb-16 space-y-10">
        <Link href="/articles" className="inline-flex items-center gap-2 text-xs font-bold text-mutedForeground uppercase tracking-[0.2em] hover:text-primary transition-colors group">
          <ChevronLeft size={14} className="transition-transform group-hover:-translate-x-1" />
          Back to Articles
        </Link>

        <div className="flex flex-col md:flex-row items-end justify-between gap-10">
          <div className="max-w-4xl space-y-6">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold text-primary uppercase tracking-[0.4em]">Wisdom Archives</span>
              <div className="h-px w-8 bg-primary/30" />
              <div className="flex items-center gap-2 text-mutedForeground">
                <Clock size={12} />
                <span className="text-[10px] font-bold tracking-widest uppercase">5 Min Read</span>
              </div>
            </div>
            <h1 className="text-5xl md:text-8xl font-serif font-bold text-fg tracking-tight leading-tight">
              {article.title}
            </h1>
            <p className="text-xl md:text-2xl text-mutedForeground font-serif italic leading-relaxed">
              "{article.summary}"
            </p>
          </div>

          <div className="flex gap-4 shrink-0 pb-2">
            <button onClick={handleLike} className={`h-14 w-14 rounded-full border flex items-center justify-center transition-all duration-300 ${isLiked ? 'bg-primary text-white border-primary shadow-rose' : 'border-border hover:border-primary hover:text-primary'}`}>
              <Heart size={20} fill={isLiked ? "currentColor" : "none"} />
            </button>
            <button onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              toast.success("Link copied");
            }} className="h-14 w-14 rounded-full border border-border flex items-center justify-center hover:bg-fg hover:text-white hover:border-fg transition-all duration-300">
              <Share2 size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* Hero Image */}
      <section className="mb-20">
        <div className="relative h-[30rem] md:h-[45rem] w-full rounded-[3.5rem] overflow-hidden shadow-rose-lg">
          {article.image_url ? (
            <Image
              src={article.image_url}
              alt={article.title}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="h-full w-full bg-muted/20 flex items-center justify-center">
              <Sparkles className="text-muted-fg/20" size={64} />
            </div>
          )}
        </div>
      </section>

      {/* Article Content - Narrow Width for Readability */}
      <article className="max-w-3xl mx-auto space-y-16">
        <div className="prose prose-lg prose-rose dark:prose-invert max-w-none font-serif text-fg/80 leading-relaxed first-letter:text-7xl first-letter:font-bold first-letter:mr-3 first-letter:float-left first-letter:text-primary">
          {article.content}
        </div>

        {/* Engagement & Feedback */}
        <section className="pt-20 border-t border-border/50 space-y-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 py-10 px-12 rounded-[2rem] bg-surface/50">
            <div className="text-center md:text-left space-y-2">
              <h3 className="text-2xl font-serif font-bold text-fg">Was this archival insight helpful?</h3>
              <p className="text-sm text-mutedForeground">Share your feedback to help us refine our botanical wisdom.</p>
            </div>

            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <button key={s} onClick={() => setRating(s)} className={`transition-all duration-300 ${rating >= s ? 'text-accent scale-110' : 'text-muted/30 hover:text-accent/40'}`}>
                  <Star size={28} fill={rating >= s ? "currentColor" : "none"} strokeWidth={1} />
                </button>
              ))}
            </div>
            <button onClick={handleReview} className="btn-primary py-4 px-10 text-xs uppercase tracking-widest">
              Rate Insight
            </button>
          </div>

          <div className="space-y-10">
            <div className="flex items-center justify-between">
              <h3 className="text-3xl font-serif font-bold text-fg">Wisdom Exchange</h3>
              <div className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-[0.3em]">
                <MessageSquare size={16} />
                {comments.length} Thoughts
              </div>
            </div>

            <div className="card-soft p-10 bg-white border-none shadow-soft">
              <textarea
                className="w-full bg-surface/30 border border-border/40 rounded-[1.5rem] p-8 text-sm focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all min-h-[150px]"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Share your perspective on this insight..."
              />
              <div className="flex justify-end mt-6">
                <button onClick={handleComment} className="btn-primary py-4 px-12 text-[10px] uppercase tracking-[0.2em] shadow-rose">
                  Contribute thought
                </button>
              </div>
            </div>

            {comments.length > 0 ? (
              <div className="space-y-10 pt-6">
                {comments.map((c) => (
                  <div key={c.id} className="group border-b border-border/20 pb-10 last:border-none">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="h-10 w-10 rounded-full bg-primary/5 border border-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                        {c.user?.[0] || 'U'}
                      </div>
                      <span className="font-bold text-xs uppercase tracking-widest text-fg">{c.user}</span>
                    </div>
                    <p className="text-lg text-mutedForeground leading-relaxed pl-14 font-serif italic">
                      "{c.text}"
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <button onClick={loadComments} className="text-xs font-bold text-primary/60 uppercase tracking-widest hover:text-primary transition-colors flex items-center gap-2 mx-auto">
                  <Sparkles size={14} />
                  View Community Insights
                </button>
              </div>
            )}
          </div>
        </section>
      </article>

      {/* Footer-like Brand Moment */}
      <section className="mt-32 pt-20 border-t border-border/50 text-center space-y-8">
        <div className="h-12 w-12 rounded-full border border-primary/20 flex items-center justify-center mx-auto">
          <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
        </div>
        <h4 className="text-2xl font-serif font-bold text-fg opacity-60">Teja Wellness · Wisdom Archives</h4>
      </section>
    </main>
  );
}
