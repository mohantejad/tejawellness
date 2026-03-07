"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type Slide = {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaHref: string;
  image: string;
};

const slides: Slide[] = [
  {
    title: "Skin Care",
    subtitle: "Nourish your glow with science-backed formulas curated for your unique profile. Beauty starts from within.",
    ctaText: "Skin Care",
    ctaHref: "/goals/skin-care",
    image: "https://images.unsplash.com/photo-1552046122-03184de85e08?q=80&w=1600&auto=format&fit=crop",
  },
  {
    title: "Hair Care",
    subtitle: "Strengthen every strand from within. Discover the botanical nutrients that power your hair health journey.",
    ctaText: "Hair Care",
    ctaHref: "/goals/hair-care",
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1600&auto=format&fit=crop",
  },
  {
    title: "The Apothecary",
    subtitle: "Hand-picked essentials for the modern seeker of health and beauty. Curated by science, inspired by nature.",
    ctaText: "Find Products",
    ctaHref: "/products",
    image: "https://images.unsplash.com/photo-1590439471364-192aa70c0b53?q=80&w=1600&auto=format&fit=crop",
  },
  {
    title: "Explore Recipes",
    subtitle: "Transform your daily meals into a powerful wellness routine with our chef-curated culinary protocols.",
    ctaText: "Explore Recipes",
    ctaHref: "/recipes",
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=1600&auto=format&fit=crop",
  },
];

export default function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = () => setIndex((i) => (i + 1) % slides.length);
  const prev = () => setIndex((i) => (i - 1 + slides.length) % slides.length);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(next, 7000);
    return () => clearInterval(id);
  }, [paused, index]);

  const current = useMemo(() => slides[index], [index]);

  return (
    <div
      className="relative rounded-[2.5rem] overflow-hidden border border-border shadow-rose-lg group/carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className="h-[35rem] md:h-[42rem] bg-cover bg-center flex items-center w-full justify-start relative transition-all duration-1000 ease-in-out"
        style={{ backgroundImage: `url(${current.image})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent" />

        {/* Subtle Overlay Pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />

        <div className="relative z-10 w-full px-8 md:px-20">
          <div className="max-w-2xl backdrop-blur-md bg-black/10 p-10 md:p-14 rounded-[3rem] border border-white/10 shadow-2xl animate-in fade-in zoom-in-95 duration-1000">
            <h1 className="text-5xl md:text-7xl font-serif font-bold leading-[1.1] text-white animate-in fade-in slide-in-from-bottom-4 duration-700 tracking-tight">
              {current.title}
            </h1>

            <p className="mt-6 text-lg md:text-xl text-white/80 max-w-lg leading-relaxed font-serif italic animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
              {current.subtitle}
            </p>

            <div className="mt-10 flex items-center gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
              <Link href={current.ctaHref} className="btn-primary px-10 py-5 text-sm uppercase tracking-[0.2em] shadow-rose-lg hover:scale-105 transition-all">
                {current.ctaText}
              </Link>
              <div className="hidden sm:block h-px w-24 bg-white/20" />
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prev}
          className="absolute left-8 top-1/2 -translate-y-1/2 h-14 w-14 rounded-full border border-white/40 text-white opacity-0 group-hover/carousel:opacity-100 transition-all duration-500 flex items-center justify-center z-20 hover:bg-white/10 hover:border-white hover:scale-110"
          aria-label="Previous slide"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <button
          onClick={next}
          className="absolute right-8 top-1/2 -translate-y-1/2 h-14 w-14 rounded-full border border-white/40 text-white opacity-0 group-hover/carousel:opacity-100 transition-all duration-500 flex items-center justify-center z-20 hover:bg-white/10 hover:border-white hover:scale-110"
          aria-label="Next slide"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* Progress Indicators */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-4 z-20">
        {slides.map((_, i) => (
          <button
            key={i}
            className={`group h-1 transition-all duration-500 relative ${i === index ? "w-12 bg-white" : "w-6 bg-white/30 hover:bg-white/50"
              }`}
            onClick={() => setIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
          >
            {i === index && (
              <div className="absolute inset-0 bg-primary/40 blur-sm -z-10" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
