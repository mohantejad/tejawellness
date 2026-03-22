'''
URL configuration for main project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
'''
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include

from .recommendations import (
    RecommendedGoalsView,
    RecommendationsView,
    RecommendedRecipesView,
    RecommendedProductsView,
    RecommendedMealPlansView,
)
from .search import GlobalSearchView
from .routines import RoutineView, IngredientSubstituteView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('auth/', include('djoser.urls')),
    path('auth/', include('users.urls')),
    path("api/", include("goals.urls")),
    path('api/', include('ingredients.urls')),
    path('api/', include('recipes.urls')),
    path('api/', include('meal_plans.urls')),
    path("api/", include("products.urls")),
    path('api/', include('articles.urls')),
    path("api/", include("rag.urls")),
    path("api/tracking/", include("tracking.urls")),
    path("api/search/", GlobalSearchView.as_view(), name="global-search"),
]

urlpatterns += [
    path("api/goals/recommended/", RecommendedGoalsView.as_view()),
    path("api/recommendations/", RecommendationsView.as_view()),
    path("api/recommendations/recipes/", RecommendedRecipesView.as_view()),
    path("api/recommendations/products/", RecommendedProductsView.as_view()),
    path("api/recommendations/meal-plans/", RecommendedMealPlansView.as_view()),
    path("api/routines/daily/", RoutineView.as_view(), name="daily-routine"),
    path("api/ingredients/substitute/", IngredientSubstituteView.as_view(), name="ingredient-substitute"),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
