from django.contrib import admin
from .models import Ingredient, IngredientMedia, IngredientBenefit, IngredientWarning


class IngredientMediaInline(admin.TabularInline):
    model = IngredientMedia
    extra = 1


class IngredientBenefitInline(admin.TabularInline):
    model = IngredientBenefit
    extra = 2


class IngredientWarningInline(admin.TabularInline):
    model = IngredientWarning
    extra = 1

@admin.register(Ingredient)
class IngredientAdmin(admin.ModelAdmin):
    list_display = ("name", "calories", "protein", "carbs", "fat")
    search_fields = ("name",)
    inlines = [IngredientMediaInline, IngredientBenefitInline, IngredientWarningInline]


# admin.site.register(IngredientMedia)
# admin.site.register(IngredientBenefit)
# admin.site.register(IngredientWarning)
