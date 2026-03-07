from django.contrib import admin
from .models import (
    Ingredient,
    IngredientMedia,
    IngredientVitamin,
    IngredientMineral,
    IngredientMicronutrient,
    IngredientGoal,
)


class IngredientMediaInline(admin.TabularInline):
    model = IngredientMedia
    extra = 1


class IngredientVitaminInline(admin.TabularInline):
    model = IngredientVitamin
    extra = 2


class IngredientMineralInline(admin.TabularInline):
    model = IngredientMineral
    extra = 2


class IngredientMicronutrientInline(admin.TabularInline):
    model = IngredientMicronutrient
    extra = 2


class IngredientGoalInline(admin.TabularInline):
    model = IngredientGoal
    extra = 1


@admin.register(Ingredient)
class IngredientAdmin(admin.ModelAdmin):
    list_display  = ('name', 'ingredient_type', 'calories', 'protein', 'carbs', 'fat')
    list_filter   = ('ingredient_type',)
    search_fields = ('name', 'description')
    prepopulated_fields = {'slug': ('name',)}
    inlines = [
        IngredientVitaminInline,
        IngredientMineralInline,
        IngredientMicronutrientInline,
        IngredientMediaInline,
        IngredientGoalInline,
    ]
