import type { Recipe } from '@/types/recipes';
import RecipeCard from './RecipeCard';

type Props = {
  recipes: Recipe[];
};

export default function RecipeListServer({ recipes }: Props) {
  if (!recipes.length) {
    return <div className="text-mutedForeground">No recipes found.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {recipes.map((r) => (
        <RecipeCard key={r.id} recipe={r} />
      ))}
    </div>
  );
}
