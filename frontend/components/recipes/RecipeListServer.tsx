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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {recipes.map((r) => (
        <RecipeCard key={r.id} recipe={r} />
      ))}
    </div>
  );
}
