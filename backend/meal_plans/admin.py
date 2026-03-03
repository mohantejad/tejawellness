from django.contrib import admin
from .models import MealPlan, MealPlanItem


class MealPlanItemInline(admin.TabularInline):
    model = MealPlanItem
    extra = 1


@admin.register(MealPlan)
class MealPlanAdmin(admin.ModelAdmin):
    list_display = ("title", "goal", "duration_days", "meals_per_day", "price", "is_published")
    list_filter = ("is_published", "goal")
    search_fields = ("title", "description")
    inlines = [MealPlanItemInline]
