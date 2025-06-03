from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.utils import timezone

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Required Email')
        email = self.normalize_email(email)
        extra_fields.setdefault('is_student', True)  
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_student', False)
        extra_fields.setdefault('is_instructor', False)

        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Supervisor must be is_superuser=True.')
        if extra_fields.get('is_staff') is not True:
            raise ValueError('The supervisor must be is_staff=True.')

        return self.create_user(email, password, **extra_fields)

class user(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    phone = models.CharField(max_length=15, null=True, blank=True)
    role = models.CharField(max_length=50, null=True, blank=True)

    is_student = models.BooleanField(default=True)
    is_instructor = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False) 
    is_superuser = models.BooleanField(default=False)
    profile_picture = models.ImageField(upload_to='profile_pictures/', null=True, blank=True)

    date_joined = models.DateTimeField(default=timezone.now)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    def __str__(self):
        return self.email

    def get_full_name(self):
        return f"{self.first_name} {self.last_name}"

    @property
    def full_name(self):
        return self.get_full_name()
