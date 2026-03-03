from django.core.management.base import BaseCommand
from rag.models import Embedding
from rag.embenddings import get_embedding

from recipes.models import Recipe
from products.models import Product
from ingredients.models import Ingredient
from meal_plans.models import MealPlan
from goals.models import Goal

class Command(BaseCommand):
    help = "Build embeddings for all content"

    def handle(self, *args, **options):
        Embedding.objects.all().delete()

        def add_item(obj, content_type, text, metadata):
            emb = get_embedding(text)
            Embedding.objects.create(
                content_type=content_type,
                object_id=obj.id,
                text=text,
                embedding=emb,
                metadata=metadata
            )

        for r in Recipe.objects.all():
            text = f"{r.title}. {r.description}. {r.instructions}"
            add_item(r, "recipe", text, {"goal": r.goal.slug if r.goal else "", "title": r.title})

        for p in Product.objects.all():
            text = f"{p.name}. {p.description}"
            add_item(p, "product", text, {"goal": p.goal.slug if p.goal else "", "title": p.name})

        for i in Ingredient.objects.all():
            text = f"{i.name}. {i.description}"
            add_item(i, "ingredient", text, {"title": i.name})

        for m in MealPlan.objects.all():
            text = f"{m.title}. {m.description}"
            add_item(m, "meal_plan", text, {"goal": m.goal.slug if m.goal else "", "title": m.title})

        for g in Goal.objects.all():
            text = f"{g.name}. {g.description}"
            add_item(g, "goal", text, {"title": g.name})

        self.stdout.write(self.style.SUCCESS("Embeddings built."))
