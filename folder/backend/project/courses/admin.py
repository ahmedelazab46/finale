from django.contrib import admin
from .models import Student, Instructor, Course, Enrollment, Review, Payment, CourseVideo, Transaction, Certificate, VideoCompletion
from users.models import user

class CourseVideoInline(admin.TabularInline):
    model = CourseVideo
    extra = 1
    fields = ('lesson_name', 'video_url', 'duration', 'order')
    verbose_name = 'Video'
    verbose_name_plural = 'Videos'

@admin.register(Instructor)
class InstructorAdmin(admin.ModelAdmin):
    list_display = ('user', 'expertise', 'phone_number', 'is_instructor', 'created_at')
    list_filter = ('is_instructor', 'expertise', 'created_at')
    search_fields = ('user__email', 'user__first_name', 'user__last_name', 'expertise')
    readonly_fields = ('created_at', 'updated_at')
    fieldsets = (
        ('User Information', {'fields': ('user', 'is_instructor')}),
        ('Contact Information', {'fields': ('phone_number',)}),
        ('Professional Information', {'fields': ('expertise', 'bio', 'profile_pic')}),
        ('Timestamps', {'fields': ('created_at', 'updated_at'), 'classes': ('collapse',)}),
    )

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('title', 'instructor', 'courseType', 'price', 'created_at')
    list_filter = ('courseType', 'category', 'level')
    search_fields = ('title', 'description')
    prepopulated_fields = {'slug': ('title',)}
    fieldsets = (
        ('Basic Information', {'fields': ('title', 'slug', 'description', 'instructor')}),
        ('Course Details', {'fields': ('duration', 'price', 'courseType', 'what_you_will_learn', 'requirements', 'level', 'category')}),
        ('Media', {'fields': ('courseImage',)}),
    )
    inlines = [CourseVideoInline]

@admin.register(CourseVideo)
class CourseVideoAdmin(admin.ModelAdmin):
    list_display = ('lesson_name', 'duration', 'order', 'created_at', 'get_course')
    list_filter = ('created_at', 'course')
    search_fields = ('lesson_name', 'course__title')
    fields = ('course', 'lesson_name', 'video_url', 'duration', 'order')

    def get_course(self, obj):
        return obj.course.title if obj.course else 'N/A'
    get_course.short_description = 'Course'

@admin.register(Certificate)
class CertificateAdmin(admin.ModelAdmin):
    list_display = ('get_student', 'get_course', 'issued_at')
    list_filter = ('issued_at',)
    search_fields = ('enrollment__student__user__email', 'enrollment__course__title')

    def get_student(self, obj):
        return obj.enrollment.student.user.email if obj.enrollment and obj.enrollment.student and obj.enrollment.student.user else 'N/A'
    get_student.short_description = 'Student'

    def get_course(self, obj):
        return obj.enrollment.course.title if obj.enrollment and obj.enrollment.course else 'N/A'
    get_course.short_description = 'Course'

@admin.register(VideoCompletion)
class VideoCompletionAdmin(admin.ModelAdmin):
    list_display = ('get_enrollment', 'get_video', 'completed_at')
    list_filter = ('completed_at',)
    search_fields = ('enrollment__student__user__email', 'video__lesson_name')

    def get_enrollment(self, obj):
        return f"{obj.enrollment.student.user.email} - {obj.enrollment.course.title}" if obj.enrollment and obj.enrollment.student and obj.enrollment.course else 'N/A'
    get_enrollment.short_description = 'Enrollment'

    def get_video(self, obj):
        return obj.video.lesson_name if obj.video else 'N/A'
    get_video.short_description = 'Video'

@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ('user', 'phone', 'get_created_at')
    list_filter = ('user__email',)
    search_fields = ('user__email', 'user__first_name', 'user__last_name')

    def get_created_at(self, obj):
        return obj.user.date_joined if obj.user and obj.user.date_joined else 'N/A'
    get_created_at.short_description = 'Created At'

@admin.register(Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):
    list_display = ('get_student', 'course', 'progress', 'get_created_at')
    list_filter = ('status',)
    search_fields = ('student__user__email', 'course__title')

    def get_student(self, obj):
        return obj.student.user.email if obj.student and obj.student.user else 'N/A'
    get_student.short_description = 'Student'

    def get_created_at(self, obj):
        return obj.date if hasattr(obj, 'date') else 'N/A'
    get_created_at.short_description = 'Enrolled At'

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('get_student', 'course', 'rating', 'get_created_at')
    list_filter = ('rating',)
    search_fields = ('student__user__email', 'course__title', 'comment')

    def get_student(self, obj):
        return obj.student.user.email if obj.student and obj.student.user else 'N/A'
    get_student.short_description = 'Student'

    def get_created_at(self, obj):
        return obj.date if hasattr(obj, 'date') else 'N/A'
    get_created_at.short_description = 'Created At'

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ('get_student', 'get_course', 'price', 'currency', 'date')
    list_filter = ('currency', 'date')
    search_fields = ('enrollment__student__user__email', 'enrollment__course__title')

    def get_student(self, obj):
        return obj.enrollment.student.user.email if obj.enrollment and obj.enrollment.student and obj.enrollment.student.user else 'N/A'
    get_student.short_description = 'Student'

    def get_course(self, obj):
        return obj.enrollment.course.title if obj.enrollment and obj.enrollment.course else 'N/A'
    get_course.short_description = 'Course'

@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ('get_user', 'get_course', 'amount', 'status', 'date')
    list_filter = ('status', 'date')
    search_fields = ('user__email', 'course__title')

    def get_user(self, obj):
        return obj.user.email if obj.user else 'N/A'
    get_user.short_description = 'User'

    def get_course(self, obj):
        return obj.course.title if obj.course else 'N/A'
    get_course.short_description = 'Course'