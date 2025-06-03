from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status , viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import user
from .serializers import UserSerializer , UserUpdateSerializer , ChangePasswordSerializer, UserProfileSerializer, InstructorProfileSerializer, StudentProfileSerializer, AdminProfileSerializer
from .permissions import IsStudent, IsInstructor, IsAdmin
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.generics import CreateAPIView
from django.core.mail import send_mail
from django.shortcuts import reverse
from users.utils import generate_password_reset_token, verify_password_reset_token
from courses.models import Course, Enrollment, Payment, Student, Instructor, Review, Transaction
from django.contrib.auth import authenticate
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAdminUser
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.db import transaction
from django.contrib.auth import get_user_model
from google.oauth2 import id_token
from google.auth.transport import requests
from dj_rest_auth.utils import jwt_encode
from django.contrib.auth import get_user_model
from dj_rest_auth.registration.views import SocialLoginView
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
import jwt
from django.conf import settings
import ssl
import smtplib

User = get_user_model()

class GoogleLoginView(APIView):
    def post(self, request):
        try:
            token = request.data.get('access_token')
            if not token:
                return Response({'error': 'Token is required'}, status=status.HTTP_400_BAD_REQUEST)

            # Decode the token
            decoded_token = jwt.decode(token, options={"verify_signature": False})
            
            # Extract user info from token
            email = decoded_token.get('email')
            if not email:
                return Response({'error': 'Email not found in token'}, status=status.HTTP_400_BAD_REQUEST)

            # Get or create user
            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                user = User.objects.create(
                    email=email,
                    first_name=decoded_token.get('given_name', ''),
                    last_name=decoded_token.get('family_name', ''),
                    is_student=True,  # Default to student
                    is_active=True
                )
                user.set_unusable_password()
                user.save()

            # Generate tokens
            refresh = RefreshToken.for_user(user)
            
            return Response({
                'access_token': str(refresh.access_token),
                'refresh_token': str(refresh),
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'is_student': user.is_student,
                    'is_instructor': user.is_instructor,
                    'is_superuser': user.is_superuser,
                }
            })

        except jwt.InvalidTokenError:
            return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class RegisterView(CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['is_student'] = user.is_student
        token['is_instructor'] = user.is_instructor
        return token
    def validate(self, attrs):
        data = super().validate(attrs)
        data['email'] = self.user.email
        data['is_student'] = self.user.is_student
        data['is_instructor'] = self.user.is_instructor
        return data
class AdminDashboardView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

    def get(self, request):
        total_users = User.objects.count()
        total_students = User.objects.filter(is_student=True).count()
        total_instructors = User.objects.filter(is_instructor=True).count()
        total_courses = Course.objects.count()
        total_enrollments = Enrollment.objects.count()
        total_payments = Payment.objects.count()
        total_reviews = Review.objects.count()
        
        recent_users = User.objects.order_by('-date_joined')[:5].values('email', 'first_name', 'last_name')
        recent_courses = Course.objects.order_by('-created_at')[:5].values('title', 'instructor__email')

        return Response({
            "stats": {
                "total_users": total_users,
                "total_students": total_students,
                "total_instructors": total_instructors,
                "total_courses": total_courses,
                "total_enrollments": total_enrollments,
                "total_payments": total_payments,
                "total_reviews": total_reviews,
            },
            "recent_users": list(recent_users),
            "recent_courses": list(recent_courses),
        })

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class StudentOnlyView(APIView):
    permission_classes = [IsAuthenticated, IsStudent]

    def get(self, request):
        return Response({"message": "welcome student!"})

class InstructorOnlyView(APIView):
    permission_classes = [IsAuthenticated, IsInstructor]

    def get(self, request):
        return Response({"message": "welcome instructor!"})

class CustomLoginView(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        user = authenticate(request, email=email, password=password)

        if user is not None:
            if not user.is_active:
                return Response({"detail": "This account is inactive."}, status=status.HTTP_403_FORBIDDEN)

            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'is_student': user.is_student,
                    'is_instructor': user.is_instructor,
                    'is_superuser': user.is_superuser,
                }
            }, status=status.HTTP_200_OK)
        else:
            return Response({'detail': 'Invalid credentials.'}, status=status.HTTP_401_UNAUTHORIZED)

class LogoutView(APIView):
    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"message": "Successfully logged out"}, status=200)
        except Exception as e:
            return Response({"error": str(e)}, status=400)        
class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        user = request.user
        serializer = UserSerializer(user)
        return Response(serializer.data)
class UserProfileUpdateView(APIView):
    permission_classes = [IsAuthenticated]
    def put(self, request):
        user = request.user
        serializer = UserUpdateSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Profile updated successfully.', 'data': serializer.data}, status=200)
        return Response(serializer.errors, status=400)
class PasswordResetRequestView(APIView):
    def post(self, request):
        email = request.data.get('email')
        try:
            user = User.objects.get(email=email)
            uid, token = generate_password_reset_token(user)
            # Use frontend URL for reset link
            reset_link = f'http://localhost:3000/reset-password/confirm?uid={uid}&token={token}'
            subject = 'Password Reset Request'
            message = f'Click the link to reset your password: {reset_link}'
            context = ssl._create_unverified_context()
            with smtplib.SMTP(settings.EMAIL_HOST, settings.EMAIL_PORT) as server:
                server.ehlo()
                server.starttls(context=context)
                server.login(settings.EMAIL_HOST_USER, settings.EMAIL_HOST_PASSWORD)
                server.sendmail(
                    settings.EMAIL_HOST_USER,
                    [email],
                    f"Subject: {subject}\n\n{message}"
                )
            return Response({'message': 'A reset link has been sent to your email.'}, status=200)
        except User.DoesNotExist:
            return Response({'error': 'There is no user with this email.'}, status=404)
        except Exception as e:
            return Response({'error': str(e)}, status=500)
class PasswordResetConfirmView(APIView):
    def post(self, request):
        uid = request.query_params.get('uid')
        token = request.query_params.get('token')
        new_password = request.data.get('new_password')
        confirm_password = request.data.get('confirm_password')
        if new_password != confirm_password:
            return Response({'error': 'The passwords do not match.'}, status=400)
        user = verify_password_reset_token(uid, token)
        if not user:
            return Response({'error': 'The link is invalid or expired.'}, status=400)
        user.set_password(new_password)
        user.save()
        return Response({'message': 'Your password has been changed successfully.'})
class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]
    def put(self, request):
        serializer = ChangePasswordSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            request.user.set_password(serializer.validated_data['new_password'])
            request.user.save()
            return Response({'message': 'Password updated successfully.'}, status=200)
        return Response(serializer.errors, status=400)
    
class UserAdminViewSet(viewsets.ModelViewSet):
    queryset =  User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated, IsAdmin]
    
@api_view(['POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAdminUser])
@transaction.atomic
def add_instructor(request):
    try:
        data = request.data
        print("Received data:", data)
        print("Data type:", type(data))
        print("Data keys:", data.keys())
        print("Content-Type:", request.content_type)

        # Check for required fields
        required_fields = ['email', 'password', 'first_name', 'last_name', 'phone_number', 'bio', 'expertise']
        missing_fields = [field for field in required_fields if field not in data]
        if missing_fields:
            print(f"Missing required fields: {missing_fields}")
            return Response({'error': f'Missing required fields: {", ".join(missing_fields)}'}, status=400)

        # Validate field values
        for field in required_fields:
            if not data[field] or str(data[field]).strip() == '':
                print(f"Empty value for field: {field}")
                return Response({'error': f'Field {field} cannot be empty'}, status=400)

        # Create user
        try:
            user = User.objects.create_user(
                email=data['email'],
                password=data['password'],
                first_name=data['first_name'],
                last_name=data['last_name'],
                is_instructor=True,
                is_student=False
            )
            print(f"User created successfully: {user.email}")
        except Exception as user_error:
            print(f"Error creating user: {str(user_error)}")
            return Response({'error': f'Error creating user: {str(user_error)}'}, status=400)

        # Create instructor
        try:
            instructor = Instructor.objects.create(
                user=user,
                phone_number=data['phone_number'],
                bio=data['bio'],
                expertise=data['expertise']
            )
            print(f"Instructor profile created successfully: {instructor}")
            return Response({
                'message': 'Instructor created successfully',
                'instructor': {
                    'id': instructor.id,
                    'email': user.email,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'phone_number': instructor.phone_number,
                    'bio': instructor.bio,
                    'expertise': instructor.expertise
                }
            }, status=201)
        except Exception as instructor_error:
            print(f"Error creating instructor profile: {str(instructor_error)}")
            # If instructor creation fails, we should delete the user we just created
            user.delete()
            return Response({'error': f'Error creating instructor profile: {str(instructor_error)}'}, status=400)
    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        return Response({'error': f'Unexpected error: {str(e)}'}, status=500)

@api_view(['PUT'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAdminUser])
@transaction.atomic
def update_instructor(request, instructor_id):
    try:
        instructor = Instructor.objects.get(id=instructor_id)
        data = request.data
        print("Received update data:", data)

        # Update user data
        user = instructor.user
        if 'first_name' in data:
            user.first_name = data['first_name']
        if 'last_name' in data:
            user.last_name = data['last_name']
        if 'email' in data:
            user.email = data['email']
        user.save()

        # Update instructor data
        if 'phone_number' in data:
            instructor.phone_number = data['phone_number']
        if 'bio' in data:
            instructor.bio = data['bio']
        if 'expertise' in data:
            instructor.expertise = data['expertise']
        instructor.save()

        return Response({
            'message': 'Instructor updated successfully',
            'instructor': {
                'id': instructor.id,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'phone_number': instructor.phone_number,
                'bio': instructor.bio,
                'expertise': instructor.expertise
            }
        }, status=200)
    except Instructor.DoesNotExist:
        return Response({'error': 'Instructor not found'}, status=404)
    except Exception as e:
        print(f"Error updating instructor: {str(e)}")
        return Response({'error': f'Error updating instructor: {str(e)}'}, status=400)

@api_view(['DELETE'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAdminUser])
@transaction.atomic
def delete_instructor(request, instructor_id):
    try:
        instructor = Instructor.objects.get(id=instructor_id)
        user = instructor.user
        
        # Delete the instructor profile first
        instructor.delete()
        # Then delete the user
        user.delete()
        
        return Response({'message': 'Instructor deleted successfully'}, status=200)
    except Instructor.DoesNotExist:
        return Response({'error': 'Instructor not found'}, status=404)
    except Exception as e:
        print(f"Error deleting instructor: {str(e)}")
        return Response({'error': f'Error deleting instructor: {str(e)}'}, status=400)

@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAdmin])
def get_instructor(request, instructor_id):
    try:
        instructor = Instructor.objects.get(id=instructor_id)
        return Response({
            'instructor': {
                'id': instructor.id,
                'email': instructor.user.email,
                'first_name': instructor.user.first_name,
                'last_name': instructor.user.last_name,
                'phone_number': instructor.phone_number,
                'bio': instructor.bio,
                'expertise': instructor.expertise
            }
        }, status=200)
    except Instructor.DoesNotExist:
        return Response({'error': 'Instructor not found'}, status=404)
    except Exception as e:
        print(f"Error getting instructor: {str(e)}")
        return Response({'error': f'Error getting instructor: {str(e)}'}, status=400)

@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAdmin])
def get_instructors(request):
    try:
        if not request.user.is_superuser:
            return Response({'error': 'Only admin users can access this endpoint'}, status=403)
            
        instructors = Instructor.objects.select_related('user').all()
        instructors_data = []
        for instructor in instructors:
            if instructor.user is None:
                print(f"Warning: Instructor {instructor.id} has no associated user")
                continue
                
            instructors_data.append({
                'id': instructor.id,
                'email': instructor.user.email,
                'first_name': instructor.user.first_name,
                'last_name': instructor.user.last_name,
                'phone_number': instructor.phone_number,
                'bio': instructor.bio,
                'expertise': instructor.expertise
            })
        return Response({'instructors': instructors_data}, status=200)
    except Exception as e:
        print(f"Error getting instructors: {str(e)}")
        return Response({'error': f'Error getting instructors: {str(e)}'}, status=400)

@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAdmin])
def get_students(request):
    try:
        students = Student.objects.select_related('user').all()
        students_data = []
        for student in students:
            if student.user is None:
                continue
            students_data.append({
                'id': student.id,
                'email': student.user.email,
                'first_name': student.user.first_name,
                'last_name': student.user.last_name,
                'phone_number': getattr(student, 'phone_number', ''),
            })
        return Response({'students': students_data}, status=200)
    except Exception as e:
        return Response({'error': f'Error getting students: {str(e)}'}, status=400)

@api_view(['POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAdmin])
def add_student(request):
    try:
        data = request.data
        required_fields = ['email', 'password', 'first_name', 'last_name', 'phone']
        for field in required_fields:
            if not data.get(field):
                return Response({'error': f'Missing field: {field}'}, status=400)
        user = User.objects.create_user(
            email=data['email'],
            password=data['password'],
            first_name=data['first_name'],
            last_name=data['last_name'],
            is_student=True,
            is_instructor=False
        )
        student = Student.objects.create(
            user=user,
            phone=data['phone']
        )
        return Response({'message': 'Student created successfully'}, status=201)
    except Exception as e:
        return Response({'error': f'Error creating student: {str(e)}'}, status=400)

@api_view(['PUT'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAdmin])
def update_student(request, student_id):
    try:
        student = Student.objects.get(id=student_id)
        data = request.data
        user = student.user
        user.first_name = data.get('first_name', user.first_name)
        user.last_name = data.get('last_name', user.last_name)
        user.email = data.get('email', user.email)
        user.save()
        student.phone = data.get('phone', student.phone)
        student.save()
        return Response({'message': 'Student updated successfully'}, status=200)
    except Student.DoesNotExist:
        return Response({'error': 'Student not found'}, status=404)
    except Exception as e:
        return Response({'error': f'Error updating student: {str(e)}'}, status=400)

@api_view(['DELETE'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAdmin])
def delete_student(request, student_id):
    try:
        student = Student.objects.get(id=student_id)
        user = student.user
        student.delete()
        user.delete()
        return Response({'message': 'Student deleted successfully'}, status=200)
    except Student.DoesNotExist:
        return Response({'error': 'Student not found'}, status=404)
    except Exception as e:
        return Response({'error': f'Error deleting student: {str(e)}'}, status=400)

@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAdmin])
def get_courses(request):
    try:
        courses = Course.objects.select_related('instructor').all()
        courses_data = []
        for course in courses:
            instructor = course.instructor
            instructor_name = instructor.get_full_name() if instructor else 'N/A'
            courses_data.append({
                'id': course.id,
                'title': course.title,
                'description': course.description,
                'price': course.price,
                'instructor': instructor_name,
                'level': getattr(course, 'level', ''),
                'category': getattr(course, 'category', ''),
            })
        return Response({'courses': courses_data}, status=200)
    except Exception as e:
        print(f"Exception in get_courses: {str(e)}")
        return Response({'error': f'Error getting courses: {str(e)}'}, status=400)

@api_view(['POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAdmin])
def add_course(request):
    try:
        data = request.data
        required_fields = ['title', 'description', 'duration', 'price', 'instructor_id', 'courseType', 'what_you_will_learn', 'level', 'category']
        for field in required_fields:
            if not data.get(field):
                return Response({'error': f'Missing field: {field}'}, status=400)
        instructor = Instructor.objects.get(id=data['instructor_id'])
        course = Course.objects.create(
            title=data['title'],
            description=data['description'],
            duration=int(data['duration']),
            price=data['price'],
            instructor=instructor.user,
            courseType=data['courseType'],
            what_you_will_learn=data['what_you_will_learn'],
            level=data.get('level', 'Beginner'),
            category=data.get('category', 'Programming'),
            slug=data.get('slug', None)
        )
        # Handle courseImage if provided
        if 'courseImage' in data and data['courseImage']:
            course.courseImage = data['courseImage']
            course.save()
        return Response({'message': 'Course created successfully'}, status=201)
    except Instructor.DoesNotExist:
        return Response({'error': 'Instructor not found'}, status=404)
    except Exception as e:
        return Response({'error': f'Error creating course: {str(e)}'}, status=400)

@api_view(['PUT'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAdmin])
def update_course(request, course_id):
    try:
        course = Course.objects.get(id=course_id)
        data = request.data
        course.title = data.get('title', course.title)
        course.description = data.get('description', course.description)
        course.price = data.get('price', course.price)
        if data.get('instructor_id'):
            instructor = Instructor.objects.get(id=data['instructor_id'])
            course.instructor = instructor.user
        course.save()
        return Response({'message': 'Course updated successfully'}, status=200)
    except Course.DoesNotExist:
        return Response({'error': 'Course not found'}, status=404)
    except Instructor.DoesNotExist:
        return Response({'error': 'Instructor not found'}, status=404)
    except Exception as e:
        return Response({'error': f'Error updating course: {str(e)}'}, status=400)

@api_view(['DELETE'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAdmin])
def delete_course(request, course_id):
    try:
        course = Course.objects.get(id=course_id)
        course.delete()
        return Response({'message': 'Course deleted successfully'}, status=200)
    except Course.DoesNotExist:
        return Response({'error': 'Course not found'}, status=404)
    except Exception as e:
        return Response({'error': f'Error deleting course: {str(e)}'}, status=400)

class InstructorProfileView(APIView):
    permission_classes = [IsAuthenticated, IsInstructor]

    def get(self, request):
        try:
            print(f"User: {request.user.email}, is_instructor: {request.user.is_instructor}")
            if not request.user.is_instructor:
                return Response(
                    {'error': 'User is not an instructor'}, 
                    status=status.HTTP_403_FORBIDDEN
                )
            instructor = Instructor.objects.get(user=request.user)
            serializer = InstructorProfileSerializer(instructor)

            # --- Statistics Calculation ---
            # Get all courses for this instructor
            courses = Course.objects.filter(instructor=request.user)
            total_courses = courses.count()

            # Get all enrollments for these courses
            enrollments = Enrollment.objects.filter(course__in=courses)
            total_students = enrollments.values('student').distinct().count()

            # Get all payments for these courses
            from django.db.models import Sum, Avg
            from courses.models import Payment, Review
            total_revenue = Payment.objects.filter(enrollment__course__in=courses).aggregate(total=Sum('price'))['total'] or 0

            # Get all reviews for these courses
            average_rating = Review.objects.filter(course__in=courses).aggregate(avg=Avg('rating'))['avg']
            average_rating = round(average_rating, 2) if average_rating else 0

            data = serializer.data.copy()
            data['total_courses'] = total_courses
            data['total_students'] = total_students
            data['total_revenue'] = float(total_revenue)
            data['average_rating'] = average_rating

            return Response(data)
        except Instructor.DoesNotExist:
            return Response(
                {'error': 'Instructor profile not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            print(f"Error in InstructorProfileView.get: {str(e)}")
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def put(self, request):
        try:
            if not request.user.is_instructor:
                return Response(
                    {'error': 'User is not an instructor'}, 
                    status=status.HTTP_403_FORBIDDEN
                )
            
            instructor = Instructor.objects.get(user=request.user)
            serializer = InstructorProfileSerializer(instructor, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Instructor.DoesNotExist:
            return Response(
                {'error': 'Instructor profile not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            print(f"Error in InstructorProfileView.put: {str(e)}")
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class StudentProfileView(APIView):
    permission_classes = [IsAuthenticated, IsStudent]

    def get(self, request):
        try:
            print(f"User: {request.user.email}, is_student: {request.user.is_student}")
            if not request.user.is_student:
                return Response(
                    {'error': 'User is not a student'}, 
                    status=status.HTTP_403_FORBIDDEN
                )
            
            student = Student.objects.select_related('user').get(user=request.user)
            serializer = StudentProfileSerializer(student)
            return Response(serializer.data)
        except Student.DoesNotExist:
            # If student profile doesn't exist, create one
            student = Student.objects.create(
                user=request.user,
                phone=request.user.phone or '',
                profile_pic=None
            )
            serializer = StudentProfileSerializer(student)
            return Response(serializer.data)
        except Exception as e:
            print(f"Error in StudentProfileView.get: {str(e)}")
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def put(self, request):
        try:
            if not request.user.is_student:
                return Response(
                    {'error': 'User is not a student'}, 
                    status=status.HTTP_403_FORBIDDEN
                )
            
            student = Student.objects.select_related('user').get(user=request.user)
            
            # Handle user data separately
            user_data = dict(request.data.get('user', {})) if isinstance(request.data.get('user', {}), dict) else request.data.get('user', {})
            if user_data:
                user_serializer = UserUpdateSerializer(student.user, data=user_data, partial=True, context={'request': request})
                if user_serializer.is_valid():
                    user_serializer.save()
                else:
                    return Response(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
            # Handle student data
            serializer = StudentProfileSerializer(student, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Student.DoesNotExist:
            return Response(
                {'error': 'Student profile not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            print(f"Error in StudentProfileView.put: {str(e)}")
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class AdminProfileView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

    def get(self, request):
        try:
            serializer = AdminProfileSerializer(request.user)
            return Response(serializer.data)
        except Exception as e:
            print(f"Error in AdminProfileView.get: {str(e)}")
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def put(self, request):
        try:
            serializer = AdminProfileSerializer(request.user, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(f"Error in AdminProfileView.put: {str(e)}")
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
