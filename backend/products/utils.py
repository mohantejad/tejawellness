from django.db import models
from .models import ProductReview

def update_product_rating(product):
    reviews = ProductReview.objects.filter(product=product)
    count = reviews.count()
    avg = reviews.aggregate(avg_rating=models.Avg('rating'))['avg_rating'] or 0
    product.average_rating = avg
    product.rating_count = count
    product.save(update_fields=['average_rating', 'rating_count'])
