from django.contrib import admin
from .models import Article, ArticleReview, ArticleComment, ArticleLike

@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'goal', 'is_published', 'average_rating', 'rating_count', 'created_at')
    search_fields = ('title', 'summary')
    list_filter = ('is_published', 'goal')
    prepopulated_fields = {'slug': ('title',)}

admin.site.register(ArticleReview)
admin.site.register(ArticleComment)
admin.site.register(ArticleLike)
