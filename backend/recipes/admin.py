from django.contrib import admin
from .models import Recipe, RecipeMedia, RecipeIngredient, RecipeReview, RecipeComment


class RecipeMediaInline(admin.TabularInline):
    model = RecipeMedia
    extra = 1


class RecipeIngredientInline(admin.TabularInline):
    model = RecipeIngredient
    extra = 2


@admin.register(Recipe)
class RecipeAdmin(admin.ModelAdmin):
    list_display = ("title", "author", "is_published", "created_at")
    search_fields = ("title", "author__email")
    list_filter = ("is_published",)
    inlines = [RecipeMediaInline, RecipeIngredientInline]


# admin.site.register(RecipeMedia)
# admin.site.register(RecipeIngredient)
# admin.site.register(RecipeReview)
# admin.site.register(RecipeComment)
