import Link from "next/link";
import Image from "next/image";
import { Sparkles } from "lucide-react";
import { Ingredient } from '@/types/ingredients';

export default function IngredientCard({ ingredient }: { ingredient: Ingredient }) {
  const typeLabel = ingredient.ingredient_type?.replace(/_/g, ' ') || 'Ingredient';

  return (
    <Link
      href={`/ingredients/${ingredient.id}`}
      className="card-soft group overflow-hidden hover:-translate-y-2 transition-all duration-500 flex flex-col h-full bg-white shadow-rose border-none"
    >
      <div className="relative h-48 w-full overflow-hidden bg-muted/10">
        {ingredient.primary_image ? (
          <Image
            src={ingredient.primary_image}
            alt={ingredient.name}
            fill
            className="object-cover transition-transform duration-1000 group-hover:scale-110"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center opacity-20">
            <Sparkles size={32} className="text-primary" />
          </div>
        )}
        <div className="absolute top-4 left-4">
          <span className="badge-pill bg-white/90 backdrop-blur-md border-none shadow-sm uppercase tracking-[0.2em] text-[8px] font-bold text-primary px-3 py-1.5">
            {typeLabel}
          </span>
        </div>
      </div>

      <div className="p-7 flex flex-col flex-grow relative">
        {/* Subtle background pattern */}
        <div className="absolute bottom-0 right-0 p-4 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity duration-700">
          <div className="h-10 w-10 rounded-full border border-primary" />
        </div>

        <h3 className="text-xl font-serif font-bold text-fg leading-tight group-hover:text-primary transition-colors duration-300">
          {ingredient.name}
        </h3>

        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
          {ingredient.calories != null && (
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-fg">{ingredient.calories}</span>
              <span className="text-[8px] uppercase tracking-widest text-mutedForeground">kcal</span>
            </div>
          )}
          {ingredient.protein != null && (
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-fg">{ingredient.protein}g</span>
              <span className="text-[8px] uppercase tracking-widest text-mutedForeground">pro</span>
            </div>
          )}
          {ingredient.carbs != null && (
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-fg">{ingredient.carbs}g</span>
              <span className="text-[8px] uppercase tracking-widest text-mutedForeground">carb</span>
            </div>
          )}
        </div>

        <div className="mt-auto pt-8 flex items-center justify-between text-[9px] font-bold text-primary uppercase tracking-[0.3em] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 duration-500 transition-all">
          Explore Botanical
          <div className="h-8 w-8 rounded-full bg-surface flex items-center justify-center text-fg group-hover:bg-primary group-hover:text-white transition-all duration-500">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}
