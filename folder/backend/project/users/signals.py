from django.dispatch import receiver
from allauth.account.signals import user_logged_in
from django.db.models.signals import post_save
from django.contrib.auth import get_user_model
from .models import StudentProfile, InstructorProfile

User = get_user_model()

@receiver(user_logged_in)
def create_profile_on_login(sender, request, user, **kwargs):
    if user.is_student:
        StudentProfile.objects.get_or_create(user=user)
    elif user.is_instructor:
        InstructorProfile.objects.get_or_create(user=user)

@receiver(post_save, sender=User)
def create_profile_on_user_creation(sender, instance, created, **kwargs):
    if created:
        if instance.is_student:
            StudentProfile.objects.get_or_create(user=instance)
        elif instance.is_instructor:
            InstructorProfile.objects.get_or_create(user=instance)
