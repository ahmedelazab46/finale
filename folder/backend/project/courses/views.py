# courses/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, viewsets
from rest_framework.permissions import IsAuthenticated
from django.db.models import Count
from django.core.exceptions import PermissionDenied
from rest_framework.generics import UpdateAPIView, DestroyAPIView, ListAPIView
from django.utils.timezone import now
from rest_framework import permissions
from .models import Course, Enrollment, Student, Review, Payment, Transaction, CourseVideo, VideoCompletion, Certificate, PaymentRecord
from .serializers import CourseSerializer, ReviewCreateSerializer, PaymentSerializer, ReviewSerializer, TransactionSerializer, EnrolledCourseSerializer
from users.permissions import IsStudent, IsInstructor, IsAdmin
from django.db.models import Q
from rest_framework.decorators import api_view, permission_classes
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from decimal import Decimal
from reportlab.pdfgen import canvas
from django.core.files.base import ContentFile
import os
import io
from django.utils import timezone



class AllCoursesView(APIView):
    permission_classes = []

    def get(self, request, *args, **kwargs):
        try:
            queryset = Course.objects.all()
            serializer = CourseSerializer(
                queryset,
                many=True,
                context={'request': request}
            )
            return Response({'courses': serializer.data})  # لف البيانات تحت مفتاح 'courses'
        except Exception as e:
            return Response(
                {'error': f'Failed to retrieve courses: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


@api_view(['GET'])
def get_categorized_courses(request):
    search_query = request.GET.get('search', '').lower()
    category = request.GET.get('category', 'All')
    min_price = request.GET.get('min_price', '0')
    max_price = request.GET.get('max_price', None)  # Remove default max_price
    level = request.GET.get('level', 'All')
    sort_by = request.GET.get('sort_by', 'popular')

    try:
        min_price = float(min_price)
        max_price = float(max_price) if max_price else None
    except ValueError:
        min_price = 0.0
        max_price = None

    courses = Course.objects.all()
    print("Total courses before filtering:", courses.count())  # Debug

    # Filter by category
    if category != 'All':
        courses = courses.filter(category=category)

    # Filter by level
    if level != 'All':
        courses = courses.filter(level=level)

    # Filter by price
    courses = courses.filter(price__gte=min_price)
    if max_price is not None:
        courses = courses.filter(price__lte=max_price)
    print("Courses after filtering:", courses.count(), list(courses.values_list('id', 'courseType', 'price', flat=False)))  # Debug

    # Search by keywords
    if search_query:
        courses = courses.filter(
            Q(title__icontains=search_query) |
            Q(instructor__first_name__icontains=search_query) |
            Q(instructor__last_name__icontains=search_query) |
            Q(category__icontains=search_query)
        ).distinct()

    # Sorting
    if sort_by == 'popular':
        courses = courses.order_by('-price')
    elif sort_by == 'newest':
        courses = courses.order_by('-id')
    elif sort_by == 'price-low':
        courses = courses.order_by('price')
    elif sort_by == 'price-high':
        courses = courses.order_by('-price')

    # Prepare response
    courses_data = []
    for course in courses:
        course_data = {
            'id': course.id,
            'slug': course.slug,
            'title': course.title,
            'description': course.description,
            'instructor': f"{course.instructor.first_name} {course.instructor.last_name}",
            'category': course.category,
            'price': float(course.price),
            'level': course.level,
            'duration': course.duration,
            'courseType': course.courseType,  # Add courseType for debugging
            'courseImage': course.courseImage.url if course.courseImage else None,
        }
        courses_data.append(course_data)

    return JsonResponse({'courses': courses_data})

class CourseDetailView(APIView):
    """
    View course details with optional authentication for enrollment status
    """
    # courses/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, viewsets
from rest_framework.permissions import IsAuthenticated
from django.db.models import Count
from django.core.exceptions import PermissionDenied
from rest_framework.generics import UpdateAPIView, DestroyAPIView, ListAPIView
from django.utils.timezone import now
from rest_framework import permissions
from .models import Course, Enrollment, Student, Review, Payment, Transaction, CourseVideo, VideoCompletion, Certificate
from .serializers import CourseSerializer, ReviewCreateSerializer, PaymentSerializer, ReviewSerializer, TransactionSerializer, EnrolledCourseSerializer, EnrolledStudentWithContactSerializer, EnrollmentStudentCourseSerializer
from users.permissions import IsStudent, IsInstructor, IsAdmin
from django.db.models import Q
from rest_framework.decorators import api_view
from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from django.db.models import Prefetch
from reportlab.pdfgen import canvas
from django.core.files.base import ContentFile
import os
import io



class AllCoursesView(APIView):
    permission_classes = []

    def get(self, request, *args, **kwargs):
        try:
            queryset = Course.objects.all()
            serializer = CourseSerializer(
                queryset,
                many=True,
                context={'request': request}
            )
            return Response({'courses': serializer.data})  # لف البيانات تحت مفتاح 'courses'
        except Exception as e:
            return Response(
                {'error': f'Failed to retrieve courses: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


@api_view(['GET'])
def get_categorized_courses(request):
    search_query = request.GET.get('search', '').lower()
    category = request.GET.get('category', 'All')
    min_price = request.GET.get('min_price', '0')
    max_price = request.GET.get('max_price', None)  # Remove default max_price
    level = request.GET.get('level', 'All')
    sort_by = request.GET.get('sort_by', 'popular')

    try:
        min_price = float(min_price)
        max_price = float(max_price) if max_price else None
    except ValueError:
        min_price = 0.0
        max_price = None

    courses = Course.objects.all()
    print("Total courses before filtering:", courses.count())  # Debug

    # Filter by category
    if category != 'All':
        courses = courses.filter(category=category)

    # Filter by level
    if level != 'All':
        courses = courses.filter(level=level)

    # Filter by price
    courses = courses.filter(price__gte=min_price)
    if max_price is not None:
        courses = courses.filter(price__lte=max_price)
    print("Courses after filtering:", courses.count(), list(courses.values_list('id', 'courseType', 'price', flat=False)))  # Debug

    # Search by keywords
    if search_query:
        courses = courses.filter(
            Q(title__icontains=search_query) |
            Q(instructor__first_name__icontains=search_query) |
            Q(instructor__last_name__icontains=search_query) |
            Q(category__icontains=search_query)
        ).distinct()

    # Sorting
    if sort_by == 'popular':
        courses = courses.order_by('-price')
    elif sort_by == 'newest':
        courses = courses.order_by('-id')
    elif sort_by == 'price-low':
        courses = courses.order_by('price')
    elif sort_by == 'price-high':
        courses = courses.order_by('-price')

    # Prepare response
    courses_data = []
    for course in courses:
        course_data = {
            'id': course.id,
            'slug': course.slug,
            'title': course.title,
            'description': course.description,
            'instructor': f"{course.instructor.first_name} {course.instructor.last_name}",
            'category': course.category,
            'price': float(course.price),
            'level': course.level,
            'duration': course.duration,
            'courseType': course.courseType,  # Add courseType for debugging
            'courseImage': course.courseImage.url if course.courseImage else None,
        }
        courses_data.append(course_data)

    return JsonResponse({'courses': courses_data})

class CourseDetailView(APIView):
    """
    عرض تفاصيل الكورس مع الفيديوهات المرتبطة به
    permission_classes = [IsAuthenticated]"""
    

    def get(self, request, slug):
        try:
            # استعلام واحد محسن يشمل:
            # - عدد الطلاب المسجلين
            # - الفيديوهات مرتبة حسب الترتيب المخصص
            # - تقدم المستخدم إذا كان مسجلاً
            course = Course.objects.annotate(
                students_count=Count('enrollment')
            ).prefetch_related(
                'videos'  # استخدم هذا بدلاً من Prefetch إذا لم تكن بحاجة لترتيب مخصص
            ).get(slug=slug)

            # حساب التقدم إذا كان المستخدم مسجلاً في الكورس
            progress = 0
            if hasattr(request.user, 'student_profile'):
                enrollment = Enrollment.objects.filter(
                    student=request.user.student_profile,
                    course=course
                ).first()
                if enrollment:
                    progress = enrollment.progress

            # إعداد بيانات الاستجابة
            serializer = CourseSerializer(course, context={'request': request})
            response_data = serializer.data
            response_data.update({
                'progress': progress,
                'lessons': self._prepare_lessons_data(course)
            })

            return Response(response_data)

        except Course.DoesNotExist:
            return Response(
                {'error': 'Course not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def _prepare_lessons_data(self, course):
        """
        تحويل الفيديوهات إلى هيكل دروس متوافق مع الواجهة
        """
        return [
            {
                'id': video.id,
                'title': video.lesson_name,
                'order': video.order,
                'duration': video.duration,
                'video_url': video.video_url,
                'is_completed': self._check_lesson_completion(course, video)
            }
            for video in course.lessons  # استخدام course.lessons بدلاً من ordered_videos
        ]

    def _check_lesson_completion(self, course, video):
        """
        التحقق من إكمال الدرس
        """
        if not hasattr(self.request.user, 'student_profile'):
            return False
        return VideoCompletion.objects.filter(
            enrollment__student=self.request.user.student_profile,
            enrollment__course=course,
            video=video
        ).exists()

class CourseVideoView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, course_slug, video_id):
        try:
            course = Course.objects.get(slug=course_slug)
            video = course.videos.get(id=video_id)

            # التحقق من صلاحية الوصول
            if not self._check_access(request.user, course):
                return Response(
                    {'error': 'أنت غير مسجل في هذا الكورس'},
                    status=status.HTTP_403_FORBIDDEN
                )

            response_data = {
                'id': video.id,
                'title': video.lesson_name,
                'video_url': video.video_url,
                'duration': video.duration,
                'next_video': self._get_next_video(course, video.order),
                'prev_video': self._get_prev_video(course, video.order),
                'is_completed': self._check_lesson_completion(course, video)
            }

            return Response(response_data)

        except Course.DoesNotExist:
            return Response(
                {'error': 'الكورس غير موجود'},
                status=status.HTTP_404_NOT_FOUND
            )
        except CourseVideo.DoesNotExist:
            return Response(
                {'error': 'الفيديو غير موجود'},
                status=status.HTTP_404_NOT_FOUND
            )

    def _check_access(self, user, course):
        if user.is_staff or course.courseType == 'Free':
            return True
        return Enrollment.objects.filter(
            student=user.student_profile,
            course=course
        ).exists()

    def _get_next_video(self, course, current_order):
        next_video = course.videos.filter(order__gt=current_order).order_by('order').first()
        return next_video.id if next_video else None

    def _get_prev_video(self, course, current_order):
        prev_video = course.videos.filter(order__lt=current_order).order_by('-order').first()
        return prev_video.id if prev_video else None

    def _check_lesson_completion(self, course, video):
        if not hasattr(self.request.user, 'student_profile'):
            return False
        return VideoCompletion.objects.filter(
            enrollment__student=self.request.user.student_profile,
            enrollment__course=course,
            video=video
        ).exists()

class MarkLessonCompletedView(APIView):
    def post(self, request):
        lesson_id = request.data.get('lesson_id')
        course_id = request.data.get('course_id')
        user = request.user

        print(f"Received: lesson_id={lesson_id}, course_id={course_id}, user={user}")

        try:
            course = Course.objects.get(id=course_id)
            lesson = CourseVideo.objects.get(id=lesson_id, course=course)
            print(f"Found lesson: id={lesson.id}, title={lesson.title}")

            student_course, created = StudentCourse.objects.get_or_create(
                student=user, course=course, defaults={'status': 'Enrolled'}
            )

            # Mark lesson as completed
            progress, created = StudentVideoProgress.objects.get_or_create(
                student=user, video=lesson, defaults={'is_completed': True}
            )
            print(f"Progress: created={created}, is_completed={progress.is_completed}")
            if not created and not progress.is_completed:
                progress.is_completed = True
                progress.save()
                print(f"Updated progress for lesson_id={lesson_id}")

            # Calculate progress
            total_videos = course.videos.count()
            completed_videos = StudentVideoProgress.objects.filter(
                student=user, video__course=course, is_completed=True
            ).count()
            progress_percentage = (completed_videos / total_videos) * 100 if total_videos > 0 else 0
            print(f"Progress calculation: completed={completed_videos}, total={total_videos}, percentage={progress_percentage}")

            # Update course status
            student_course.progress = progress_percentage
            if progress_percentage >= 100:
                student_course.status = 'Completed'
            student_course.save()

            # Find next video
            lessons = CourseVideo.objects.filter(course=course).order_by('order')
            next_video = None
            for i, vid in enumerate(lessons):
                if vid.id == lesson.id and i < len(lessons) - 1:
                    next_video = lessons[i + 1]
                    break
            print(f"Next video: {next_video.id if next_video else None}")

            response_data = {
                'status': 'success',
                'progress': progress_percentage,
                'course_status': student_course.status,
                'next_video_id': next_video.id if next_video else None
            }
            print(f"Response: {response_data}")
            return Response(response_data)
        except Course.DoesNotExist:
            print(f"Course not found: course_id={course_id}")
            return Response({'error': 'Course not found'}, status=status.HTTP_404_NOT_FOUND)
        except CourseVideo.DoesNotExist:
            print(f"Lesson not found: lesson_id={lesson_id}, course_id={course_id}")
            return Response({'error': 'Lesson not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            print(f"Error: {str(e)}")
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class InstructorCourseListView(APIView):
    permission_classes = [IsAuthenticated, IsInstructor]

    def get(self, request):
        courses = Course.objects.filter(instructor=request.user)
        serializer = CourseSerializer(courses, many=True)
        return Response(serializer.data)

class CourseCreateView(APIView):
    permission_classes = [IsAuthenticated, IsInstructor]

    def post(self, request):
        serializer = CourseSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            course = serializer.save(instructor=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CourseUpdateView(UpdateAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [IsAuthenticated, IsInstructor]

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    def perform_update(self, serializer):
        course = self.get_object()
        if course.instructor != self.request.user:
            raise PermissionDenied("You can only edit your own courses.")
        serializer.save()

    def get_queryset(self):
        return Course.objects.filter(instructor=self.request.user)

class CourseDeleteView(DestroyAPIView):
    queryset = Course.objects.all()
    permission_classes = [IsAuthenticated, IsInstructor]

    def perform_destroy(self, instance):
        if instance.instructor != self.request.user:
            raise PermissionDenied("You can only delete your own courses.")
        instance.delete()

class StudentEnrolledCoursesView(ListAPIView):
    serializer_class = EnrolledCourseSerializer
    permission_classes = [IsAuthenticated, IsStudent]

    def get_queryset(self):
        user = self.request.user
        if hasattr(user, 'student_profile'):
           student = user.student_profile
           return Enrollment.objects.filter(student=student)
        else:
            # يمكنك إرجاع QuerySet فارغ أو رفع استثناء مخصص
            return Enrollment.objects.none()


class SubmitReviewView(APIView):
    permission_classes = [IsAuthenticated, IsStudent]

    def post(self, request):
        serializer = ReviewCreateSerializer(data=request.data)
        if serializer.is_valid():
            student = request.user.student_profile
            course = serializer.validated_data['course']

            is_enrolled = Enrollment.objects.filter(student=student, course=course).exists()
            if not is_enrolled:
                return Response({'error': 'You are not enrolled in this course.'}, status=403)
            
            if Review.objects.filter(student=student, course=course).exists():
                return Response({'error': 'You have already submitted a review for this course.'}, status=400)
            
            Review.objects.create(student=student, course=course, date=now().date(), rating=serializer.validated_data['rating'], comment=serializer.validated_data['comment'])
            return Response({'message': 'Review submitted successfully.'}, status=201)

        return Response(serializer.errors, status=400)

class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]
        


class CourseAdminViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [IsAuthenticated, IsAdmin]

class PaymentAdminViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated, IsAdmin]
    def get_queryset(self):
        user = self.request.user
        if user.is_superuser or user.is_admin:
            return Payment.objects.all()
        elif user.is_student:
            return Payment.objects.filter(enrollment__student=user.student_profile)
        return Payment.objects.none()

    

class UpdateProgressView(APIView):
    permission_classes = [IsAuthenticated, IsStudent]

    def post(self, request):
        course_id = request.data.get("course_id")
        progress = request.data.get("progress") 

        if not (0 <= float(progress) <= 100):
            return Response({'error': 'Progress must be between 0 and 100'}, status=400)

        try:
            student = request.user.student_profile
            enrollment = Enrollment.objects.get(student=student, course_id=course_id)
            enrollment.progress = progress
            enrollment.save()
            return Response({'message': 'Progress updated successfully.'})
        except Enrollment.DoesNotExist:
            return Response({'error': 'Enrollment not found'}, status=404)

class CertificateView(APIView):
    permission_classes = [IsAuthenticated, IsStudent]

    def get(self, request, course_id):
        try:
            student = request.user.student_profile
            enrollment = Enrollment.objects.get(student=student, course_id=course_id)

            if enrollment.progress < 100:
                return Response({'error': 'Course is not completed yet.'}, status=400)

            full_name = f"{request.user.first_name} {request.user.last_name}"
            course_title = enrollment.course.title
            date = enrollment.date.strftime("%Y-%m-%d")

            return Response({
                "message": "Certificate generated successfully.",
                "name": full_name,
                "course": course_title,
                "completion_date": date,
            })

        except Enrollment.DoesNotExist:
            return Response({'error': 'Enrollment not found'}, status=404)
        
class ReviewViewSet(viewsets.ModelViewSet):
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser or user.is_admin:
            return Review.objects.all()
        elif user.is_student:
            return Review.objects.filter(student=user.student_profile)
        return Review.objects.none()

    def perform_create(self, serializer):
        user = self.request.user
        course = serializer.validated_data['course']
        student = user.student_profile

        if Review.objects.filter(course=course, student=student).exists():
            raise serializers.ValidationError("You have already reviewed this course.")

        if not Enrollment.objects.filter(course=course, student=student).exists():
            raise serializers.ValidationError("You must be enrolled in the course to leave a review.")

        serializer.save(student=student)

@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdmin])
def admin_transactions(request):
    transactions = Transaction.objects.all()
    serializer = TransactionSerializer(transactions, many=True)
    return Response(serializer.data)

class MarkLessonCompletedView(APIView):
    permission_classes = [IsAuthenticated, IsStudent]

    def post(self, request):
        lesson_id = request.data.get('lesson_id')
        course_id = request.data.get('course_id')
        
        if not lesson_id or not course_id:
            return Response(
                {'error': 'lesson_id و course_id مطلوبان'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            student = request.user.student_profile
            enrollment = Enrollment.objects.get(student=student, course_id=course_id)
            video = CourseVideo.objects.get(id=lesson_id, course_id=course_id)

            # تسجيل إكمال الفيديو
            completion, created = VideoCompletion.objects.get_or_create(
                enrollment=enrollment,
                video=video,
                defaults={'completed_at': now()}
            )
            
            # حساب التقدم
            total_videos = enrollment.course.videos.count()
            completed_videos = enrollment.video_completions.count()
            enrollment.progress = (completed_videos / total_videos * 100) if total_videos > 0 else 0
            
            # تحديث الحالة وإنشاء شهادة إذا اكتمل الكورس
            if enrollment.progress >= 100:
                enrollment.status = 'Completed'
                # إنشاء شهادة إذا لم تكن موجودة
                certificate, created = Certificate.objects.get_or_create(
                    enrollment=enrollment,
                    defaults={
                        'issued_at': now(),
                        'certificate_file': ContentFile(
                            self.generate_certificate_pdf(
                                f"{request.user.first_name} {request.user.last_name}",
                                enrollment.course.title,
                                enrollment.date.strftime("%Y-%m-%d")
                            ),
                            name=f"certificate_{course_id}_{student.id}.pdf"
                        )
                    }
                )

            enrollment.save()

            return Response({
                'status': 'success',
                'progress': enrollment.progress,
                'course_status': enrollment.status
            }, status=status.HTTP_200_OK)

        except Enrollment.DoesNotExist:
            return Response(
                {'error': 'أنت غير مسجل في هذا الكورس'},
                status=status.HTTP_404_NOT_FOUND
            )
        except CourseVideo.DoesNotExist:
            return Response(
                {'error': 'الفيديو غير موجود في هذا الكورس'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': f'خطأ غير متوقع: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def generate_certificate_pdf(self, name, course_title, date):
        buffer = io.BytesIO()
        p = canvas.Canvas(buffer)
        p.drawString(100, 750, "شهادة إتمام")
        p.drawString(100, 700, f"الاسم: {name}")
        p.drawString(100, 650, f"الدورة: {course_title}")
        p.drawString(100, 600, f"التاريخ: {date}")
        p.showPage()
        p.save()
        return buffer.getvalue()

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def enroll_in_course(request):
    try:
        course_id = request.data.get('course_id')
        course = get_object_or_404(Course, id=course_id)
        user = request.user

        # Get or create student profile
        student = None
        if hasattr(user, 'student_profile'):
            student = user.student_profile
        else:
            student = Student.objects.create(user=user, phone='')

        # Check if user is already enrolled
        if Enrollment.objects.filter(student=student, course=course).exists():
            return Response({'error': 'You are already enrolled in this course'}, status=status.HTTP_400_BAD_REQUEST)

        # Handle payment for paid courses
        if course.courseType.lower() == 'paid':
            payment_id = request.data.get('payment_id')
            payment_status = request.data.get('payment_status')
            payment_amount = request.data.get('payment_amount')
            payment_currency = request.data.get('payment_currency', 'USD')

            if not all([payment_id, payment_status, payment_amount]):
                return Response({'error': 'Payment information is required for paid courses'}, status=status.HTTP_400_BAD_REQUEST)

            # Verify payment amount matches course price
            if Decimal(str(payment_amount)) != course.price:
                return Response({'error': 'Payment amount does not match course price'}, status=status.HTTP_400_BAD_REQUEST)

            # Create payment record
            PaymentRecord.objects.create(
                user=user,
                course=course,
                payment_id=payment_id,
                payment_status=payment_status,
                payment_amount=payment_amount,
                payment_currency=payment_currency
            )

        # Create enrollment with current date
        enrollment = Enrollment.objects.create(
            student=student,
            course=course,
            date=timezone.now().date(),
            status='In Progress',
            progress=0.0
        )

        return Response({
            'message': 'Successfully enrolled in the course',
            'enrollment_id': enrollment.id
        }, status=status.HTTP_201_CREATED)

    except Course.DoesNotExist:
        return Response({'error': 'Course not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        print(f"Enrollment error: {str(e)}")  # Add server-side logging
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class InstructorEnrolledStudentsView(APIView):
    permission_classes = [IsAuthenticated, IsInstructor]

    def get(self, request):
        courses = Course.objects.filter(instructor=request.user)
        enrollments = Enrollment.objects.filter(course__in=courses).select_related('student__user', 'course')
        serializer = EnrollmentStudentCourseSerializer(enrollments, many=True)
        return Response(serializer.data)  # Allow any user to view course details