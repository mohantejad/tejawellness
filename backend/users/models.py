'''Custom user model and manager for authentication.'''

from django.db import models
from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.utils import timezone


class UserAccountManager(BaseUserManager):
    # Manager for creating regular users and superusers with email login.
    def create_user(self, email: str, password: str | None = None, **extra_fields):
        if not email:
            raise ValueError('Users must have an email address')
        
        # Normalize and standardize email before storing.
        email = self.normalize_email(email).lower()
        user = self.model(email=email, **extra_fields)
        # Hashes the raw password (or marks unusable if None).
        user.set_password(password)
        user.save(using=self._db)

        return user

    def create_superuser(self, email: str, password: str | None =None, **extra_fields):
        # Ensure elevated permissions for superusers.
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        user = self.create_user(email, password=password, **extra_fields)
        return user

class UserAccount(AbstractBaseUser, PermissionsMixin):
    # Core identity fields.
    email = models.EmailField(max_length=255, unique=True)
    first_name = models.CharField(max_length=155, blank=True)
    last_name = models.CharField(max_length=155, blank=True)
    
    # Account status and metadata.
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Attach the custom manager.
    objects = UserAccountManager()

    # Use email as the unique login identifier.
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS: list[str] = []

    class Meta:
        indexes = [models.Index(fields=["email"])]

    def get_full_name(self):
        return f"{self.first_name} {self.last_name}".strip()

    def get_short_name(self):
        return (self.first_name or self.email).strip()

    def __str__(self):
        return self.email


class UserProfile(models.Model):
    SKIN_TYPES = [
        ('dry', 'Dry'),
        ('oily', 'Oily'),
        ('combination', 'Combination'),
        ('sensitive', 'Sensitive'),
        ('normal', 'Normal'),
    ]
    HAIR_TYPES = [
        ('straight', 'Straight'),
        ('wavy', 'Wavy'),
        ('curly', 'Curly'),
        ('coily', 'Coily'),
    ]
    HAIR_TEXTURES = [
        ('fine', 'Fine'),
        ('medium', 'Medium'),
        ('thick', 'Thick'),
    ]

    user = models.OneToOneField(UserAccount, on_delete=models.CASCADE, related_name='profile')
    
    skin_type = models.CharField(max_length=20, choices=SKIN_TYPES, blank=True)
    hair_type = models.CharField(max_length=20, choices=HAIR_TYPES, blank=True)
    hair_texture = models.CharField(max_length=20, choices=HAIR_TEXTURES, blank=True)
    
    # Comma-separated or JSON list of concerns (e.g. "acne, aging, frizz")
    skin_concerns = models.TextField(blank=True, help_text="Specific skin concerns")
    hair_concerns = models.TextField(blank=True, help_text="Specific hair concerns")

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Profile for {self.user.email}"