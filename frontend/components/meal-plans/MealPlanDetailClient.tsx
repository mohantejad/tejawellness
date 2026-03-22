"use client";

import Image from "next/image";
import { API_BASE } from "@/api/base";
import { Calendar, Clock, BookOpen, Star } from "lucide-react";

export default function MealPlanDetailClient({ mealPlan }: { mealPlan: any }) {
  const image = mealPlan.primary_image ? (mealPlan.primary_image.startsWith('http') ? mealPlan.primary_image : `${API_BASE}${mealPlan.primary_image}`) : undefined;

  return (
    <main className="container-page py-20 animate-in fade-in duration-1000">
      <div className="max-w-5xl mx-auto space-y-16">
        <header className="space-y-8 text-center">
            <div className="flex items-center justify-center gap-3 text-primary">
              <Calendar size={24} />
              <h2 className="text-[10px] font-bold uppercase tracking-[0.5em]">Guided Protocol</h2>
            </div>
            <h1 className="text-6xl md:text-8xl font-serif font-bold text-fg tracking-tight leading-none">
              {mealPlan.title}
            </h1>
            <p className="text-2xl text-mutedForeground font-serif italic max-w-2xl mx-auto">
              {mealPlan.description || "A structured journey towards optimal radiance and vitality."}
            </p>
        </header>

        <div className="relative h-[35rem] rounded-[3rem] overflow-hidden shadow-rose-2xl">
          {image ? (
            <Image src={image} alt={mealPlan.title} fill className="object-cover" />
          ) : (
             <div className="h-full w-full bg-muted/20" />
          )}
          <div className="absolute inset-x-0 bottom-0 p-12 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
             <div className="flex flex-wrap items-center gap-10">
                <div className="flex flex-col gap-1">
                   <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest flex items-center gap-2"><Clock size={12}/> Duration</span>
                   <span className="text-xl font-bold text-white uppercase tracking-wider">{mealPlan.days_count} Days</span>
                </div>
                <div className="flex flex-col gap-1">
                   <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest flex items-center gap-2"><BookOpen size={12}/> Complexity</span>
                   <span className="text-xl font-bold text-white uppercase tracking-wider">Advanced</span>
                </div>
                <div className="flex flex-col gap-1">
                   <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest flex items-center gap-1"><Star size={12} fill="currentColor"/> Rating</span>
                   <span className="text-xl font-bold text-white tracking-wider">4.9 / 5.0</span>
                </div>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
           <div className="card-soft p-10 space-y-6">
              <h3 className="text-xl font-serif font-bold text-fg">Preparation</h3>
              <p className="text-sm text-mutedForeground leading-relaxed">
                 Gather the essential botanical elements listed in the protocol. Ensure your sanctuary is prepared for the upcoming ritual.
              </p>
           </div>
           <div className="card-soft p-10 space-y-6">
              <h3 className="text-xl font-serif font-bold text-fg">Daily Ritual</h3>
              <p className="text-sm text-mutedForeground leading-relaxed">
                 Follow the structured timeline for meal consumption and mindfulness exercises. Consistency is the key to cellular reset.
              </p>
           </div>
           <div className="card-soft p-10 space-y-6">
              <h3 className="text-xl font-serif font-bold text-fg">Integration</h3>
              <p className="text-sm text-mutedForeground leading-relaxed">
                 Observe the shifts in your energy and radiance. Slowly integrate the protocol's wisdom into your permanent lifestyle.
              </p>
           </div>
        </div>
      </div>
    </main>
  );
}
