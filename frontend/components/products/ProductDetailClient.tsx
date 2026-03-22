"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
    toggleProductLike,
    fetchProductById,
    createProductReview,
    fetchProductComments,
    createProductComment,
} from "@/api/products";
import type { Product, ProductReview, ProductComment } from "@/types/products";
import { API_BASE } from "@/api/base";
import {
    ChevronLeft,
    Heart,
    Share2,
    Star,
    ShoppingBag,
    Sparkles,
    Info,
    MessageSquare
} from "lucide-react";
import { toast } from "sonner";

export default function ProductDetailClient({ product }: { product: Product }) {
    const [likeCount, setLikeCount] = useState<number>(product.like_count ?? 0);
    const [isLiked, setIsLiked] = useState<boolean>(product.is_liked ?? false);
    const [avgRating, setAvgRating] = useState<number>(product.average_rating ?? 0);
    const [ratingCount, setRatingCount] = useState<number>(product.rating_count ?? 0);

    const [reviews, setReviews] = useState<ProductReview[]>(product.reviews ?? []);
    const [rating, setRating] = useState<number>(5);

    const [comments, setComments] = useState<ProductComment[]>([]);
    const [commentText, setCommentText] = useState<string>("");
    const [loadingComments, setLoadingComments] = useState(false);

    const rawImage = product.primary_image || product.image_url || product.media?.[0]?.image_url;
    const mainImage =
        rawImage && rawImage.startsWith("http")
            ? rawImage
            : rawImage
                ? `${API_BASE}${rawImage}`
                : undefined;

    const [activeImage, setActiveImage] = useState<string | undefined>(mainImage);

    const mediaImages = (product.media || [])
        .map((m) => m.image_url)
        .filter(Boolean)
        .map((img) => (img!.startsWith("http") ? img! : `${API_BASE}${img}`));

    async function handleLike() {
        try {
            const res = await toggleProductLike(product.id);
            setIsLiked(res.liked);
            setLikeCount(res.like_count);
            if (res.liked) toast.success("Added to your apothecary selection");
        } catch {
            toast.error("Sign in to save products");
        }
    }

    async function handleReview() {
        try {
            const newReview = await createProductReview(product.id, { rating });
            setReviews((prev) => {
                const idx = prev.findIndex((r) => r.user === newReview.user);
                if (idx === -1) return [newReview, ...prev];
                const copy = [...prev];
                copy[idx] = newReview;
                return copy;
            });
            const updated = await fetchProductById(product.id);
            setAvgRating(updated.average_rating ?? 0);
            setRatingCount(updated.rating_count ?? 0);
            toast.success("Review submitted");
        } catch {
            toast.error("You've already reviewed this product");
        }
    }

    async function loadComments() {
        setLoadingComments(true);
        try {
            const data = await fetchProductComments(product.id);
            const list = Array.isArray(data) ? data : data?.results || [];
            setComments(list);
        } catch {
            setComments([]);
        } finally {
            setLoadingComments(false);
        }
    }

    async function handleComment() {
        if (!commentText.trim()) return;
        try {
            const newComment = await createProductComment(product.id, { text: commentText });
            setComments((prev) => [newComment, ...prev]);
            setCommentText("");
            toast.success("Comment posted");
        } catch {
            toast.error("Sign in to post comments");
        }
    }

    return (
        <main className="container-page py-12 animate-in fade-in duration-1000">
            {/* Editorial Header */}
            <section className="mb-12 space-y-8">
                <Link href="/products" className="inline-flex items-center gap-2 text-xs font-bold text-mutedForeground uppercase tracking-[0.2em] hover:text-primary transition-colors group">
                    <ChevronLeft size={14} className="transition-transform group-hover:-translate-x-1" />
                    Back to Apothecary
                </Link>

                <div className="flex flex-col md:flex-row items-start justify-between gap-10">
                    <div className="max-w-3xl space-y-4">
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] font-bold text-primary uppercase tracking-[0.4em]">Product Details</span>
                            <div className="h-px w-8 bg-primary/30" />
                            <div className="flex items-center gap-1 text-accent">
                                <Star size={12} fill="currentColor" />
                                <span className="text-[10px] font-bold tracking-widest">{avgRating.toFixed(1)}</span>
                            </div>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-serif font-bold text-fg tracking-tight leading-tight">
                            {product.name}
                        </h1>
                    </div>

                    <div className="flex gap-4 shrink-0">
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

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                {/* Left Column: Visuals & Depth */}
                <section className="lg:col-span-7 space-y-12">
                    <div className="relative aspect-square w-full rounded-[3rem] overflow-hidden shadow-rose-lg transform-gpu border border-border/40">
                        {activeImage ? (
                            <Image
                                src={activeImage}
                                alt={product.name}
                                fill
                                className="object-cover"
                                priority
                            />
                        ) : (
                            <div className="h-full w-full bg-muted/20 flex items-center justify-center">
                                <Sparkles size={48} className="text-muted-fg/20" />
                            </div>
                        )}
                    </div>

                    {mediaImages.length > 1 && (
                        <div className="flex gap-4 p-2 overflow-x-auto">
                            {mediaImages.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveImage(img)}
                                    className={`h-24 w-24 flex-shrink-0 rounded-2xl border-2 transition-all duration-300 overflow-hidden ${activeImage === img ? "border-primary scale-105 shadow-md" : "border-transparent opacity-60 hover:opacity-100"}`}
                                >
                                    <Image src={img} alt={`${product.name} thumb ${idx}`} width={96} height={96} className="h-full w-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}

                    <div className="space-y-10">
                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                <h2 className="text-3xl font-serif font-bold text-fg">Scientific Curation</h2>
                                <div className="h-px grow bg-border/50" />
                            </div>
                            <p className="text-xl text-mutedForeground font-serif italic leading-relaxed">
                                &quot;{product.description}&quot;
                            </p>
                        </div>

                        {/* Engagement Tabs-like sections */}
                        <div className="space-y-8 pt-12 border-t border-border/50">
                            <div className="flex items-center justify-between">
                                <h3 className="text-2xl font-serif font-bold text-fg">Client Insights</h3>
                                <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-widest">
                                    <MessageSquare size={16} />
                                    {comments.length || ratingCount}
                                </div>
                            </div>

                            <div className="card-soft p-8 bg-surface/30 border-none">
                                <textarea
                                    className="w-full bg-white/50 border border-border/50 rounded-2xl p-6 text-sm focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all min-h-[120px]"
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                    placeholder="Share your experience..."
                                />
                                <div className="flex justify-end mt-4">
                                    <button onClick={handleComment} className="btn-primary py-3 px-8 text-[10px] uppercase tracking-[0.2em]">
                                        Post Thought
                                    </button>
                                </div>
                            </div>

                            {comments.length > 0 ? (
                                <div className="space-y-8 pl-4">
                                    {comments.map((c) => (
                                        <div key={c.id} className="group border-b border-border/30 pb-6">
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                                                    {c.user?.[0] || 'U'}
                                                </div>
                                                <div className="font-bold text-xs text-fg">{c.user}</div>
                                            </div>
                                            <p className="text-sm text-mutedForeground leading-relaxed pl-11">{c.text}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <button onClick={loadComments} className="text-xs font-bold text-primary/60 uppercase tracking-widest hover:text-primary transition-colors">
                                    Load previous conversations...
                                </button>
                            )}
                        </div>
                    </div>
                </section>

                {/* Right Column: Acquisition & Meta */}
                <aside className="lg:col-span-5 space-y-8">
                    <div className="card-soft p-12 bg-white shadow-rose-lg border-none sticky top-24 space-y-10">
                        <div className="space-y-2">
                            <div className="flex items-baseline justify-between">
                                <span className="text-xs font-bold text-mutedForeground uppercase tracking-[0.3em]">Curation Price</span>
                                <span className="text-[10px] font-bold text-accent uppercase tracking-widest">Tax Included</span>
                            </div>
                            <div className="text-6xl font-serif font-bold text-fg tracking-tight">
                                ${product.price}
                            </div>
                        </div>

                        <div className="space-y-4">
                            {product.affiliate_url && (
                                <Link
                                    href={product.affiliate_url}
                                    target="_blank"
                                    className="btn-primary w-full flex items-center justify-center gap-3 py-6 shadow-rose hover:scale-[1.02] transition-transform text-xs uppercase tracking-[0.2em]"
                                >
                                    <ShoppingBag size={20} />
                                    Acquire on Store
                                </Link>
                            )}
                            <button onClick={handleLike} className="btn-outline w-full py-5 text-xs uppercase tracking-[0.2em] hover:bg-fg/5">
                                {isLiked ? "In Selection" : "Add to Selection"}
                            </button>
                        </div>

                        <div className="pt-8 border-t border-border/50">
                            <h3 className="text-[10px] font-bold text-primary uppercase tracking-[0.4em] mb-6 text-center">Protocol Synergy</h3>
                            <div className="flex justify-center gap-2 mb-8">
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <button key={s} onClick={() => setRating(s)} className={`transition-all duration-300 ${rating >= s ? 'text-accent scale-110' : 'text-muted/30 hover:text-accent/40'}`}>
                                        <Star size={24} fill={rating >= s ? "currentColor" : "none"} strokeWidth={1} />
                                    </button>
                                ))}
                            </div>
                            <button onClick={handleReview} className="w-full text-[10px] font-bold text-fg uppercase tracking-[0.3em] flex items-center justify-center gap-2 opacity-60 hover:opacity-100 transition-opacity">
                                Verify this Selection
                            </button>
                        </div>

                        <div className="text-center">
                            <p className="text-[9px] text-mutedForeground uppercase tracking-[0.2em] leading-relaxed">
                                Free Shipping on Curations over $150 <br />
                                Sourced with Botanical Integrity
                            </p>
                        </div>
                    </div>

                    <div className="card-soft p-10 bg-surface/50 border-none flex items-start gap-4">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            <Info size={18} className="text-primary" />
                        </div>
                        <div>
                            <h4 className="text-[10px] font-bold uppercase tracking-widest text-fg mb-1">Nourishment Integrity</h4>
                            <p className="text-xs text-mutedForeground leading-relaxed">This product has been vetted against our botanical library for bioavailability and efficacy.</p>
                        </div>
                    </div>
                </aside>
            </div>
        </main>
    );
}
