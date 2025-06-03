from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import user

class CustomUserAdmin(UserAdmin):
    model = user
    list_display = ('email', 'first_name', 'last_name', 'is_student', 'is_instructor', 'is_superuser')
    list_filter = ('is_student', 'is_instructor', 'is_superuser', 'is_staff', 'is_active')
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal Information', {'fields': ('first_name', 'last_name')}),
        ('Permissions', {'fields': ('is_student', 'is_instructor', 'is_superuser', 'is_staff', 'is_active', 'groups', 'user_permissions')}),
        ('dates', {'fields': ('last_login', 'date_joined')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'first_name', 'last_name', 'password1', 'password2', 'is_student', 'is_instructor', 'is_superuser', 'is_staff')}
        ),
    )
    search_fields = ('email',)
    ordering = ('email',)

admin.site.register(user, CustomUserAdmin)
