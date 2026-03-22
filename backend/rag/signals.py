from django.db.models.signals import post_save
from django.dispatch import receiver
from recipes.models import Recipe
from products.models import Product
from ingredients.models import Ingredient
from meal_plans.models import MealPlan
from .models import Embedding
from .embenddings import get_embedding

def update_embedding(obj, content_type, text, metadata):
    emb = get_embedding(text)
    Embedding.objects.update_or_create(
        content_type=content_type,
        object_id=obj.id,
        defaults={
            "text": text,
            "embedding": emb,
            "metadata": metadata
        }
    )

@receiver(post_save, sender=Recipe)
def recipe_saved(sender, instance, **kwargs):
    text = f"{instance.title}. {instance.description}. {instance.instructions}"
    update_embedding(instance, "recipe", text, {"goal": instance.goal.slug if instance.goal else "", "title": instance.title})

@receiver(post_save, sender=Product)
def product_saved(sender, instance, **kwargs):
    text = f"{instance.name}. {instance.description}"
    update_embedding(instance, "product", text, {"goal": instance.goal.slug if instance.goal else "", "title": instance.name})

@receiver(post_save, sender=Ingredient)
def ingredient_saved(sender, instance, **kwargs):
    text = f"{instance.name}. {instance.description}"
    update_embedding(instance, "ingredient", text, {"title": instance.name})

@receiver(post_save, sender=MealPlan)
def meal_plan_saved(sender, instance, **kwargs):
    text = f"{instance.title}. {instance.description}"
    update_embedding(instance, "meal_plan", text, {"goal": instance.goal.slug if instance.goal else "", "title": instance.title})
