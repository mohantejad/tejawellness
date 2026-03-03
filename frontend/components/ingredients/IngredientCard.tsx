import Link from "next/link";
import Image from "next/image";
import type { Ingredient } from "@/types/ingredients";

export default function IngredientCard({ ingredient }: { ingredient: Ingredient }) {
  const image = ingredient.primary_image || ingredient.media?.[0]?.image_url;

  return (
    <Link
      href={`/ingredients/${ingredient.id}`}
      className="group rounded-2xl border border-border bg-card overflow-hidden hover:-translate-y-1 transition"
    >
      {image ? (
        <Image
          src={image}
          alt={ingredient.name}
          width={600}
          height={320}
          className="h-28 w-full object-cover"
        />
      ) : (
        <div className="h-28 bg-muted" />
      )}
      <div className="p-4">
        <div className="text-sm text-mutedForeground">Ingredient</div>
        <div className="text-lg font-semibold group-hover:text-primary transition">
          {ingredient.name}
        </div>
      </div>
    </Link>
  );
}
