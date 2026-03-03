from django.db import models
from django.utils.text import slugify

class Goal(models.Model):
    name = models.CharField(max_length=120, unique=True)
    slug = models.SlugField(max_length=140, unique=True, blank=True)
    description = models.TextField(blank=True)
    image_url = models.ImageField(upload_to="goals/images", blank=True, null=True)
    image_recipes = models.ImageField(upload_to="goals/images/recipes/", blank=True, null=True)
    image_products = models.ImageField(upload_to="goals/images/products/", blank=True, null=True)
    image_workouts = models.ImageField(upload_to="goals/images/workouts/", blank=True, null=True)
    image_articles = models.ImageField(upload_to="goals/images/articles/", blank=True, null=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            base = slugify(self.name)
            slug = base
            counter = 1
            while Goal.objects.filter(slug=slug).exists():
                slug = f"{base}-{counter}"
                counter += 1
            self.slug = slug
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name
    
    class Meta:
        indexes = [models.Index(fields=['slug'])]