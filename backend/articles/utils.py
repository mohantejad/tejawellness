from django.db import models
from .models import ArticleReview

def update_article_rating(article):
    reviews = ArticleReview.objects.filter(article=article)
    count = reviews.count()
    avg = reviews.aggregate(avg_rating=models.Avg('rating'))['avg_rating'] or 0
    article.average_rating = avg
    article.rating_count = count
    article.save(update_fields=['average_rating', 'rating_count'])
