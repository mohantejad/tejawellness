"use client";

import { useState } from "react";
import Image from "next/image";
import {
    toggleProductLike,
    fetchProductById,
    createProductReview,
    fetchProductComments,
    createProductComment,
} from "@/api/products";
import type { Product, ProductReview, ProductComment } from "@/types/products";
import { API_BASE } from "@/api/base";


export default function ProductDetailClient({ product }: { product: Product }) {
    const [likeCount, setLikeCount] = useState<number>(product.like_count ?? 0);
    const [isLiked, setIsLiked] = useState<boolean>(product.is_liked ?? false);
    const [avgRating, setAvgRating] = useState<number>(product.average_rating ?? 0);
    const [ratingCount, setRatingCount] = useState<number>(product.rating_count ?? 0);

    const [reviews, setReviews] = useState<ProductReview[]>(product.reviews ?? []);
    const [rating, setRating] = useState<number>(5);

    const [comments, setComments] = useState<ProductComment[]>([]);
    const [commentText, setCommentText] = useState<string>("");

    async function handleLike() {
        const res = await toggleProductLike(product.id);
        setIsLiked(res.liked);
        setLikeCount(res.like_count);
    }

    async function handleReview() {
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
    }

    async function loadComments() {
        const data = await fetchProductComments(product.id);
        const list = Array.isArray(data) ? data : data?.results || [];
        setComments(list);
    }

    async function handleComment() {
        const newComment = await createProductComment(product.id, { text: commentText });
        setComments((prev) => [newComment, ...prev]);
        setCommentText("");
    }

    const rawImage = product.primary_image || product.image_url || product.media?.[0]?.image_url;
    const image =
        rawImage && rawImage.startsWith("http")
            ? rawImage
            : rawImage
            ? `${API_BASE}${rawImage}`
            : undefined;

    const [activeImage, setActiveImage] = useState<string | undefined>(image);

    const mediaImages = (product.media || [])
        .map((m) => m.image_url)
        .filter(Boolean)
        .map((img) => (img!.startsWith("http") ? img! : `${API_BASE}${img}`));

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <section className="lg:col-span-7 space-y-6">
                {activeImage ? (
                    <Image
                        src={activeImage}
                        alt={product.name}
                        width={1200}
                        height={800}
                        className="rounded-3xl object-cover w-full h-96"
                    />
                ) : (
                    <div className="h-96 rounded-3xl bg-muted flex items-center justify-center">
                        Product
                    </div>
                )}

                {mediaImages.length > 1 && (
                    <div className="flex gap-2">
                        {mediaImages.map((img, idx) => (
                            <button
                                key={idx}
                                onClick={() => setActiveImage(img)}
                                className={`h-16 w-16 rounded-xl border ${activeImage === img ? "border-primary" : "border-border"} overflow-hidden`}
                            >
                                <Image src={img} alt="thumb" width={64} height={64} className="h-full w-full object-cover" />
                            </button>
                        ))}
                    </div>
                )}

                <div>
                    <h1 className="text-4xl font-bold">{product.name}</h1>
                    <p className="text-mutedForeground mt-2">{product.description}</p>
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
                    <div className="text-2xl font-bold">${product.price}</div>
                    <div className="text-sm text-mutedForeground">
                        ⭐ {avgRating} ({ratingCount})
                    </div>

                    <button
                        onClick={handleLike}
                        className="mt-4 w-full rounded-xl bg-primary text-primaryForeground py-2"
                    >
                        {isLiked ? "Unlike" : "Like"} · {likeCount}
                    </button>
                    {product.affiliate_url && (
                        <a
                            href={product.affiliate_url}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-2 block w-full rounded-xl border border-border py-2 text-center"
                        >
                            Buy on Amazon
                        </a>
                    )}
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
