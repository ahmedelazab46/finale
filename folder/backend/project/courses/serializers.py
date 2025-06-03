from rest_framework import serializers
from .models import Course, CourseVideo, Instructor, Review, Student, Payment, Transaction, Enrollment, VideoCompletion
class InstructorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Instructor
        fields = ['id', 'name', 'email', 'phone', 'bio', 'profile_pic']

class CourseVideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseVideo
        fields = ['id', 'lesson_name', 'video_url', 'duration','formatted_duration', 'order', 'created_at', 'updated_at']

class ReviewCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ['course', 'rating', 'comment']
        
class ReviewSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.user.get_full_name', read_only=True)
    course_title = serializers.CharField(source='course.title', read_only=True)

    class Meta:
        model = Review
        fields = ['id', 'course_title', 'student_name', 'date', 'rating', 'comment']

class CourseSerializer(serializers.ModelSerializer):
    certificate_available = serializers.SerializerMethodField()
    progress = serializers.SerializerMethodField()
    videos = CourseVideoSerializer(many=True, read_only=True)
    courseImage = serializers.ImageField(required=False)
    lessons = serializers.SerializerMethodField()
    is_enrolled = serializers.SerializerMethodField()
    instructor_name = serializers.SerializerMethodField()
    students_count = serializers.SerializerMethodField()
    revenue = serializers.SerializerMethodField()
    average_rating = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = [
            'id', 'title', 'description', 'duration', 'price',
            'instructor', 'courseImage', 'courseType', 'what_you_will_learn',
            'requirements', 'level', 'category', 'created_at', 'slug',
            'certificate_available', 'progress', 'videos', 'lessons',
            'is_enrolled', 'instructor_name', 'students_count', 'revenue',
            'average_rating'
        ]
        read_only_fields = ['instructor', 'slug']

    def get_certificate_available(self, obj):
        # التحقق مما إذا كان الطالب قد أكمل الكورس (progress = 100%)
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            return False
        
        try:
            student = request.user.student_profile
            enrollment = Enrollment.objects.filter(student=student, course=obj).first()
            if enrollment and enrollment.progress >= 100:
                return True  # الشهادة متاحة إذا كان التقدم 100%
            return False  # الشهادة غير متاحة إذا لم يكتمل الكورس
        except (Student.DoesNotExist, AttributeError):
            return False

    def get_is_enrolled(self, obj):
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            return False
        try:
            student = request.user.student_profile
            return Enrollment.objects.filter(student=student, course=obj).exists()
        except (Student.DoesNotExist, AttributeError):
            return False
    def get_progress(self, obj):
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            return 0
        try:
            student = request.user.student_profile
            enrollment = Enrollment.objects.filter(student=student, course=obj).first()
            if not enrollment:
                return 0
            completed_videos = VideoCompletion.objects.filter(enrollment=enrollment).count()
            total_videos = obj.videos.count()
            return (completed_videos / total_videos * 100) if total_videos > 0 else 0
        except (Student.DoesNotExist, AttributeError):
            return 0

    def get_courseImage(self, obj):
        if obj.courseImage:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.courseImage.url)
            return obj.courseImage.url if hasattr(obj.courseImage, 'url') else None
        return None

    def get_instructor_name(self, obj):
        if obj.instructor:
            return obj.instructor.get_full_name() or obj.instructor.username or 'Unknown Instructor'
        return 'Unknown Instructor'

    def get_lessons(self, obj):
        videos = obj.videos.order_by('order')
        user = None
        student = None
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            user = request.user
            try:
                student = user.student_profile
            except (Student.DoesNotExist, AttributeError):
                student = None

        return [{
            'id': video.id,
            'title': video.lesson_name,
            'order': video.order,
            'created_at': video.created_at,
            'updated_at': video.updated_at,
            'duration': video.duration,
            'video_url': video.video_url if user else None,
            'is_completed': VideoCompletion.objects.filter(
                enrollment__course=obj,
                enrollment__student=student,
                video=video
            ).exists() if user and student else False
        } for video in videos]

    def create(self, validated_data):
        request = self.context.get('request')
        if not request or not request.user:
            raise serializers.ValidationError('User must be authenticated')

        # تعيين المدرس
        validated_data['instructor'] = request.user

        # معالجة الصورة
        if 'courseImage' in request.FILES:
            validated_data['courseImage'] = request.FILES['courseImage']

        try:
            course = Course.objects.create(**validated_data)
            return course
        except Exception as e:
            print(f"Error creating course: {str(e)}")
            raise serializers.ValidationError(f"Could not create course: {str(e)}")

    def update(self, instance, validated_data):
        request = self.context.get('request')
        
        # معالجة الصورة في حالة التحديث
        if request and 'courseImage' in request.FILES:
            instance.courseImage = request.FILES['courseImage']
        
        for attr, value in validated_data.items():
            if attr != 'courseImage':  # تجنب تحديث الصورة هنا لأننا عالجناها أعلاه
                setattr(instance, attr, value)
        
        instance.save()
        return instance

    def get_students_count(self, obj):
        return Enrollment.objects.filter(course=obj).count()

    def get_revenue(self, obj):
        from .models import Payment
        from django.db.models import Sum
        return float(Payment.objects.filter(enrollment__course=obj).aggregate(total=Sum('price'))['total'] or 0)

    def get_average_rating(self, obj):
        from .models import Review
        from django.db.models import Avg
        avg = Review.objects.filter(course=obj).aggregate(Avg('rating'))['rating__avg']
        return round(avg, 2) if avg else 0

class EnrolledStudentSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='user.get_full_name')
    email = serializers.EmailField(source='user.email')

    class Meta:
        model = Student
        fields = ['name', 'email']

class EnrolledStudentWithContactSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='user.get_full_name')
    email = serializers.EmailField(source='user.email')
    phone = serializers.CharField( required=False)

    class Meta:
        model = Student
        fields = ['id', 'name', 'email', 'phone']
        
class PaymentSerializer(serializers.ModelSerializer):
    course_title = serializers.CharField(source='enrollment.course.title', read_only=True)
    student_name = serializers.CharField(source='enrollment.student.user.get_full_name', read_only=True)

    class Meta:
        model = Payment
        fields = ['id', 'date', 'price', 'currency', 'course_title', 'student_name']

class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = ['id', 'user', 'course', 'amount', 'date', 'status']

class EnrolledCourseSerializer(serializers.ModelSerializer):
    course = CourseSerializer()
    progress = serializers.FloatField()
    status = serializers.CharField()

    class Meta:
        model = Enrollment
        fields = ['course', 'progress', 'status']

    def to_representation(self, instance):
        data = super().to_representation(instance)
        course_data = data.pop('course')
        return {**course_data, 'progress': data['progress'], 'status': data['status']}
    
class EnrollmentStudentCourseSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='student.user.get_full_name', read_only=True)
    email = serializers.EmailField(source='student.user.email', read_only=True)
    phone = serializers.CharField(source='student.phone', read_only=True)
    course_title = serializers.CharField(source='course.title', read_only=True)

    class Meta:
        model = Enrollment
        fields = ['id', 'name', 'email', 'phone', 'course_title']