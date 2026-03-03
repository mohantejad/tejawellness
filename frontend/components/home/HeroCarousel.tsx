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
    title: "Fuel your best day",
    subtitle: "Smart meals, clean macros, and lifestyle guidance.",
    ctaText: "Explore Recipes",
    ctaHref: "/recipes",
    image: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=1600&auto=format&fit=crop",
  },
  {
    title: "Beauty from within",
    subtitle: "Nutrition + tips tailored for healthy skin & hair.",
    ctaText: "Explore Beauty",
    ctaHref: "/articles",
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1600&auto=format&fit=crop",
  },
  {
    title: "Strong body, calm mind",
    subtitle: "Fitness plans and meal prep made simple.",
    ctaText: "Explore Fitness",
    ctaHref: "/ingredients",
    image: "https://images.unsplash.com/photo-1546483875-ad9014c88eba?q=80&w=1600&auto=format&fit=crop",
  },
  {
    title: "Wellness shop curated for you",
    subtitle: "Supplements, essentials, and smart products.",
    ctaText: "Visit Shop",
    ctaHref: "/products",
    image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1600&auto=format&fit=crop",
  },
];

export default function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = () => setIndex((i) => (i + 1) % slides.length);
  const prev = () => setIndex((i) => (i - 1 + slides.length) % slides.length);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(next, 5000);
    return () => clearInterval(id);
  }, [paused]);

  const current = useMemo(() => slides[index], [index]);

  return (
    <div
      className="relative rounded-3xl overflow-hidden border border-border shadow-soft"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className="h-90 md:h-105 bg-cover bg-center flex items-center w-full justify-start px-8 md:px-12 relative"
        style={{ backgroundImage: `url(${current.image})` }}
      >
        <div className="absolute inset-0 bg-black/40" />

        <button
          onClick={prev}
          className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/80 hover:bg-white transition flex items-center justify-center"
          aria-label="Previous slide"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        <div className="relative z-10 max-w-xl text-white flex flex-col items-start text-left pl-10">
          <h1 className="text-4xl md:text-5xl font-bold">{current.title}</h1>
          <p className="mt-3 text-white/90">{current.subtitle}</p>
          <Link
            href={current.ctaHref}
            className="inline-block mt-6 px-6 py-3 rounded-full border border-white text-black bg-black font-semibold hover:opacity-90 transition"
          >
            {current.ctaText}
          </Link>
        </div>

        <button
          onClick={next}
          className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/80 hover:bg-white transition flex items-center justify-center"
          aria-label="Next slide"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            className={`h-2 w-2 rounded-full transition ${i === index ? "bg-white" : "bg-white/40"}`}
            onClick={() => setIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
