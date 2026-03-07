"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { fetchMixedRecommendations, MixedRecommendation } from "@/api/recommendations";
import { useAppSelector } from "@/redux/hooks";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

export default function RecommendedRow() {
  const { user } = useAppSelector((s) => s.auth);
  const [items, setItems] = useState<MixedRecommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!user) {
      setItems([]);
      return;
    }

    let active = true;

    (async () => {
      if (active) setLoading(true);
      try {
        const data = await fetchMixedRecommendations();
        if (active) setItems(data);
      } catch {
        if (active) setItems([]);
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [user]);

  if (!user) return null;

  const scrollBy = (dir: "left" | "right") => {
    if (!scrollerRef.current) return;
    const amount = dir === "left" ? -400 : 400;
    scrollerRef.current.scrollBy({ left: amount, behavior: "smooth" });
  };

  return (
    <section className="space-y-10 py-12 animate-in fade-in duration-1000">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3 text-primary">
            <Sparkles size={20} className="animate-pulse" />
            <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary">Your Bespoke Selection</h2>
          </div>
          <h3 className="text-4xl font-serif font-bold text-fg leading-tight mt-2">Recommended for your glow</h3>
        </div>

        <div className="hidden md:flex gap-3">
          <button
            onClick={() => scrollBy("left")}
            className="h-12 w-12 rounded-full border border-border flex items-center justify-center hover:bg-white hover:text-primary hover:border-primary transition-all shadow-rose duration-300"
            aria-label="Scroll left"
          >
            <ChevronLeft size={24} strokeWidth={1.5} />
          </button>
          <button
            onClick={() => scrollBy("right")}
            className="h-12 w-12 rounded-full border border-border flex items-center justify-center hover:bg-white hover:text-primary hover:border-primary transition-all shadow-rose duration-300"
            aria-label="Scroll right"
          >
            <ChevronRight size={24} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {loading && (
        <div className="flex gap-6 overflow-hidden">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="card-soft min-w-[320px] h-56 animate-pulse bg-muted/20" />
          ))}
        </div>
      )}

      {!loading && items.length === 0 && (
        <div className="card-soft p-16 text-center bg-surface/30 border-dashed border-2 border-border/50 flex flex-col items-center">
          <div className="h-16 w-16 rounded-full bg-primary/5 flex items-center justify-center mb-6">
            <Sparkles className="text-primary/20" size={32} />
          </div>
          <h4 className="text-xl font-serif font-bold text-fg">Your ritual is waiting.</h4>
          <p className="text-mutedForeground mt-2 max-w-sm mx-auto">Complete your discovery profile to unlock science-backed recommendations tailored to your unique biology.</p>
          <Link href="/account" className="mt-8 text-[10px] font-bold text-primary uppercase tracking-[0.2em] border-b border-primary/20 pb-1 hover:border-primary transition-all">Begin Discovery</Link>
        </div>
      )}

      {items.length > 0 && (
        <div className="relative group/row">
          <div
            ref={scrollerRef}
            className="flex gap-8 overflow-x-auto scroll-smooth no-scrollbar pb-8 px-1"
          >
            {items.map((item) => (
              <Link
                key={`${item.type}-${item.id}`}
                href={item.type === "meal_plan" ? `/meal-plans/${item.id}` : `/${item.type}s/${item.id}`}
                className="card-soft p-8 min-w-[340px] max-w-[340px] hover:-translate-y-2 transition-all duration-500 relative overflow-hidden group/card border-transparent hover:border-border/50 shadow-rose"
              >
                {/* Subtle Background Pattern */}
                <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />

                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-10 -mt-10 transition-all duration-700 group-hover/card:scale-125 group-hover/card:bg-primary/10" />

                <div className="relative z-10">
                  <span className="badge-pill mb-6 bg-white/80 border-none shadow-sm capitalize text-[9px] tracking-widest px-3 py-1.5">
                    {item.type.replace('_', ' ')}
                  </span>

                  <h3 className="text-2xl font-serif font-bold text-fg leading-[1.3] mt-2 min-h-[4rem] group-hover:text-primary transition-colors duration-300">
                    {item.title}
                  </h3>

                  <div className="flex items-center justify-between mt-8 pt-6 border-t border-border/40">
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] font-bold text-mutedForeground uppercase tracking-widest">Target Goal</span>
                      <span className="text-xs text-primary font-bold uppercase tracking-[0.1em]">{item.goal}</span>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-surface flex items-center justify-center text-fg/40 group-hover/card:bg-primary group-hover/card:text-white transition-all duration-500">
                      <ChevronRight size={18} />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Scroll fade indicators */}
          <div className="absolute top-0 right-0 h-full w-24 bg-linear-to-l from-bg to-transparent pointer-events-none opacity-0 group-hover/row:opacity-100 transition-opacity" />
          <div className="absolute top-0 left-0 h-full w-24 bg-linear-to-r from-bg to-transparent pointer-events-none opacity-0 group-hover/row:opacity-100 transition-opacity" />
        </div>
      )}
    </section>
  );
}
