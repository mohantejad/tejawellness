"use client";

import Image from "next/image";
import { API_BASE } from "@/api/base";
import { Sparkles, Leaf, Info } from "lucide-react";

export default function IngredientDetailClient({ ingredient }: { ingredient: any }) {
  const image = ingredient.image ? (ingredient.image.startsWith('http') ? ingredient.image : `${API_BASE}${ingredient.image}`) : undefined;

  return (
    <main className="container-page py-20 animate-in fade-in duration-1000">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
        <div className="relative aspect-square rounded-[3rem] overflow-hidden shadow-rose-lg border border-border/50">
          {image ? (
            <Image src={image} alt={ingredient.name} fill className="object-cover" />
          ) : (
            <div className="h-full w-full bg-muted/20 flex items-center justify-center">
              <Leaf size={64} className="text-primary/20" />
            </div>
          )}
        </div>

        <div className="space-y-10 py-10">
          <header className="space-y-6">
            <div className="flex items-center gap-3 text-primary">
              <Leaf size={24} />
              <h2 className="text-[10px] font-bold uppercase tracking-[0.5em]">Botanical Component</h2>
            </div>
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-fg tracking-tight">{ingredient.name}</h1>
            <p className="text-xl text-mutedForeground font-serif italic leading-relaxed">
              {ingredient.description || "A vital component of our botanical wellness system."}
            </p>
          </header>

          <div className="grid grid-cols-2 gap-6">
            <div className="card-soft p-6 flex flex-col gap-2">
              <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Type</span>
              <span className="text-sm font-bold text-fg">{ingredient.ingredient_type}</span>
            </div>
            <div className="card-soft p-6 flex flex-col gap-2">
              <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Base Purity</span>
              <span className="text-sm font-bold text-fg">100% Organic</span>
            </div>
          </div>
          
          <div className="space-y-6">
             <div className="flex items-center gap-3 text-fg">
                <Info size={18} className="text-primary" />
                <h3 className="text-xs font-bold uppercase tracking-widest">Scientific Insights</h3>
             </div>
             <div className="p-8 rounded-[2rem] bg-surface border border-border/40 text-sm text-mutedForeground leading-relaxed mb-6">
                This botanical element is rigorously screened for bio-available compounds that support cellular radiance and metabolic harmony.
             </div>
          </div>
        </div>
      </div>
    </main>
  );
}
