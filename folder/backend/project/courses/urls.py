from django.urls import path
from rest_framework.routers import DefaultRouter
from . import views
from .views import CourseDetailView,InstructorCourseListView, CourseCreateView, AllCoursesView, CourseUpdateView, CourseDeleteView, StudentEnrolledCoursesView, SubmitReviewView, CourseAdminViewSet, PaymentAdminViewSet, UpdateProgressView, CertificateView, PaymentViewSet, ReviewViewSet, get_categorized_courses, MarkLessonCompletedView, enroll_in_course

urlpatterns = [
    path('api/courses/', get_categorized_courses, name='get_categorized_courses'),
    path('all/', AllCoursesView.as_view(), name='all_courses'),
    path('course/<slug:slug>/', CourseDetailView.as_view(), name='course_detail'),
    path('instructor/courses/', InstructorCourseListView.as_view(), name='instructor_courses'),
    path('instructor/add-course/', CourseCreateView.as_view(), name='add_course'),
    path('instructor/edit-course/<int:pk>/', CourseUpdateView.as_view(), name='edit_course'),
    path('instructor/delete-course/<int:pk>/', CourseDeleteView.as_view(), name='delete_course'),
    path('student/enrolled-courses/', StudentEnrolledCoursesView.as_view(), name='enrolled_courses'),
    path('student/review/', SubmitReviewView.as_view(), name='submit-review'),
    path('student/update-progress/', UpdateProgressView.as_view(), name='update_progress'),
    path('student/certificate/<int:course_id>/', CertificateView.as_view(), name='get_certificate'),
    path('student/mark-lesson-completed/', MarkLessonCompletedView.as_view(), name='mark_lesson_completed'), 
    path('student/enroll/', views.enroll_in_course, name='enroll-course'), 
    path('instructor/enrolled-students/', views.InstructorEnrolledStudentsView.as_view(), name='instructor_enrolled_students'), 
]

router = DefaultRouter()
router.register('admin/courses', CourseAdminViewSet, basename='admin-courses')
router.register('admin/payments', PaymentAdminViewSet, basename='admin-payments')
router.register('student/payments', PaymentViewSet, basename='student-payments')
router.register('admin/reviews', ReviewViewSet, basename='admin-reviews')
urlpatterns += router.urls