from django.db import models
from django.utils.text import slugify
from django.utils import timezone
from django.conf import settings

class Student(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='student_profile')
    phone = models.CharField(max_length=20, blank=True, default='')
    profile_pic = models.ImageField(upload_to='profiles/%Y/%m/%d', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, null=True)

    def __str__(self):
        return self.user.email

class Instructor(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='instructor_profile', null=True, blank=True)
    phone_number = models.CharField(max_length=20, default="", verbose_name="Phone Number")
    bio = models.TextField(default="", verbose_name="Bio")
    expertise = models.CharField(max_length=200, null=True, blank=True, verbose_name="Expertise")
    is_instructor = models.BooleanField(default=True, verbose_name="Is Instructor")
    created_at = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True, null=True, blank=True)
    profile_pic = models.ImageField(upload_to='instructors/%Y/%m/%d', null=True, blank=True)

    class Meta:
        verbose_name = 'Instructor'
        verbose_name_plural = 'Instructors'

    def __str__(self):
        if self.user:
            return f"{self.user.get_full_name()} - {self.expertise}"
        return f"Instructor - {self.expertise or 'No expertise specified'}"

    def save(self, *args, **kwargs):
        if self.user and not self.user.is_instructor:
            self.user.is_instructor = True
            self.user.save()
        super().save(*args, **kwargs)

class Course(models.Model):
    LEVEL_CHOICES = [
        ('Beginner', 'Beginner'),
        ('Intermediate', 'Intermediate'),
        ('Advanced', 'Advanced'),
    ]
    CATEGORY_CHOICES = [
        ('Programming', 'Programming'),
        ('Design', 'Design'),
        ('Marketing', 'Marketing'),
        ('Business', 'Business'),
        ('Data Science', 'Data Science'),
    ]
    title = models.CharField(max_length=200)
    description = models.TextField()
    duration = models.IntegerField(help_text="Duration in hours")
    price = models.DecimalField(max_digits=10, decimal_places=2)
    instructor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='courses')
    courseImage = models.ImageField(upload_to='courses/%Y/%m/%d', null=True, blank=True)
    courseType = models.CharField(max_length=20, choices=[('Free', 'Free'), ('Paid', 'Paid')])
    what_you_will_learn = models.TextField()
    requirements = models.TextField()
    level = models.CharField(max_length=20, choices=LEVEL_CHOICES, null=True, blank=True, default='Beginner')
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, null=True, blank=True, default='Programming')
    created_at = models.DateTimeField(default=timezone.now)
    slug = models.SlugField(max_length=200, blank=True, null=True)
    # videos = models.ManyToManyField('CourseVideo', related_name='courses', blank=True)


    @property
    def lessons(self):
        return self.videos.all().order_by('order')
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super(Course, self).save(*args, **kwargs)

    def __str__(self):
        return self.title

    def get_image_url(self):
        if self.courseImage and hasattr(self.courseImage, 'url'):
            return self.courseImage.url
        return None

class CourseVideo(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='videos', null=True, blank=True)
    lesson_name = models.CharField(max_length=255)
    video_url = models.URLField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    duration = models.PositiveIntegerField(default=0, help_text="Duration in seconds")
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']
        unique_together = ('course', 'order')  # ضمان أن يكون order فريدًا لكل كورس

    def __str__(self):
        return f"Video: {self.lesson_name}"
    
    def formatted_duration(self):
        minutes = self.duration // 60
        seconds = self.duration % 60
        return f"{minutes:02d}:{seconds:02d}"
    

class Enrollment(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    date = models.DateField()
    progress = models.FloatField(default=0.0)
    status = models.CharField(max_length=20, choices=[('Enrolled', 'Enrolled'), ('Completed', 'Completed')], default='Enrolled')

    def __str__(self):
        return f"{self.student.user.email} enrolled in {self.course.title}"

    class Meta:
        unique_together = ('student', 'course')
        
        
class VideoCompletion(models.Model):
    enrollment = models.ForeignKey(Enrollment, on_delete=models.CASCADE, related_name='video_completions')
    video = models.ForeignKey(CourseVideo, on_delete=models.CASCADE)
    completed_at = models.DateTimeField(auto_now_add=True)
    class Meta:
        unique_together = ('enrollment', 'video')

class Review(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='reviews')
    date = models.DateField()
    rating = models.IntegerField()
    comment = models.TextField()
    
    class Meta:
        unique_together = ['student', 'course']

    def __str__(self):
        return f"{self.student.user.username} reviewed {self.course.title}"

class Payment(models.Model):
    enrollment = models.ForeignKey(Enrollment, on_delete=models.CASCADE)
    date = models.DateField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, default='USD')

    def __str__(self):
        return f"Payment of ${self.price} USD for {self.enrollment.course.title}"
    
class Transaction(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateField()
    status = models.CharField(max_length=20, choices=[('Completed', 'Completed'), ('Pending', 'Pending')])
    

class Certificate(models.Model):
    enrollment = models.OneToOneField(Enrollment, on_delete=models.CASCADE)
    issued_at = models.DateTimeField(auto_now_add=True)
    certificate_file = models.FileField(upload_to='certificates/%Y/%m/%d')

class PaymentRecord(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    course = models.ForeignKey('Course', on_delete=models.CASCADE)
    payment_id = models.CharField(max_length=255)
    payment_status = models.CharField(max_length=50)
    payment_amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_currency = models.CharField(max_length=3, default='USD')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Payment {self.payment_id} for {self.course.title} by {self.user.email}"