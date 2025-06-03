from django.urls import path
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from dj_rest_auth.registration.views import SocialLoginView
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.models import SocialAccount
from .views import (
    AdminDashboardView,
    UserAdminViewSet,
    CustomTokenObtainPairView,
    RegisterView,
    UserProfileView,
    UserProfileUpdateView,
    ChangePasswordView,
    PasswordResetRequestView,
    PasswordResetConfirmView,
    StudentOnlyView,
    InstructorOnlyView,
    LogoutView,
    CustomLoginView,
    add_instructor,
    update_instructor,
    delete_instructor,
    get_instructors,
    get_instructor,
    get_students,
    add_student,
    update_student,
    delete_student,
    get_courses,
    add_course,
    update_course,
    delete_course,
    InstructorProfileView,
    StudentProfileView,
    AdminProfileView,
    GoogleLoginView,
)

urlpatterns = [
    path('api/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    # Authentication endpoints
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', CustomLoginView.as_view(), name='custom_login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('google-login/', GoogleLoginView.as_view(), name='google-login'),
    
    # Profile endpoints
    path('profile/', UserProfileView.as_view(), name='user_profile'),
    path('profile/update/', UserProfileUpdateView.as_view(), name='profile_update'),
    
    # Role-specific profile endpoints
    path('instructor/profile/', InstructorProfileView.as_view(), name='instructor_profile'),
    path('instructor/profile/update/', InstructorProfileView.as_view(), name='instructor_profile_update'),
    path('student/profile/', StudentProfileView.as_view(), name='student_profile'),
    path('student/profile/update/', StudentProfileView.as_view(), name='student_profile_update'),
    path('admin/profile/', AdminProfileView.as_view(), name='admin_profile'),
    path('admin/profile/update/', AdminProfileView.as_view(), name='admin_profile_update'),
    
    # Password management
    path('change-password/', ChangePasswordView.as_view(), name='change_password'),
    path('password-reset/', PasswordResetRequestView.as_view(), name='password_reset_request'),
    path('password-reset/confirm/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    
    # Role-specific endpoints
    path('student/dashboard/', StudentOnlyView.as_view(), name='student_only'),
    path('instructor/dashboard/', InstructorOnlyView.as_view(), name='instructor_only'),
    path('admin/dashboard/', AdminDashboardView.as_view(), name='admin_dashboard'),
    
    # Instructor management endpoints
    path('admin/add-instructor/', add_instructor, name='add_instructor'),
    path('admin/instructors/', get_instructors, name='get_instructors'),
    path('admin/instructors/<int:instructor_id>/', get_instructor, name='get_instructor'),
    path('admin/instructors/<int:instructor_id>/update/', update_instructor, name='update_instructor'),
    path('admin/instructors/<int:instructor_id>/delete/', delete_instructor, name='delete_instructor'),
    
    # Student management endpoints
    path('admin/students/', get_students, name='get_students'),
    path('admin/students/add/', add_student, name='add_student'),
    path('admin/students/<int:student_id>/update/', update_student, name='update_student'),
    path('admin/students/<int:student_id>/delete/', delete_student, name='delete_student'),
    
    # Course management endpoints
    path('admin/courses/', get_courses, name='get_courses'),
    path('admin/courses/add/', add_course, name='add_course'),
    path('admin/courses/<int:course_id>/update/', update_course, name='update_course'),
    path('admin/courses/<int:course_id>/delete/', delete_course, name='delete_course'),
]

# Admin router
router = DefaultRouter()
router.register(r'admin/users', UserAdminViewSet, basename='admin-users')
urlpatterns += router.urls