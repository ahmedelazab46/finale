from rest_framework import serializers
from .models import user
from courses.models import Instructor, Student
import re

class UserSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(write_only=True)
    is_student = serializers.BooleanField(default=True)
    is_instructor = serializers.BooleanField(default=False)

    class Meta:
        model = user
        fields = [
            'id', 'email', 'first_name', 'last_name',
            'password', 'confirm_password', 'profile_picture',
            'is_student', 'is_instructor'
        ]
        extra_kwargs = {'password': {'write_only': True}}

    def validate_password(self, value):
        if len(value) < 8:
            raise serializers.ValidationError("Password must be at least 8 characters long.")
        if not re.search(r'[A-Z]', value):
            raise serializers.ValidationError("Password must contain at least one uppercase letter.")
        if not re.search(r'[a-z]', value):
            raise serializers.ValidationError("Password must contain at least one lowercase letter.")
        if not re.search(r'\d', value):
            raise serializers.ValidationError("Password must contain at least one digit.")
        if not re.search(r'[^A-Za-z0-9]', value):
            raise serializers.ValidationError("Password must contain at least one special character.")
        return value

    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError("Passwords do not match.")
        if data.get('is_student') and data.get('is_instructor'):
            raise serializers.ValidationError("A user cannot be both a student and a lecturer at the same time.")
        return data

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        password = validated_data.pop('password')

        user_instance = user(**validated_data)
        user_instance.set_password(password)
        user_instance.save()
        return user_instance


class UserUpdateSerializer(serializers.ModelSerializer):
    current_password = serializers.CharField(write_only=True, required=False)
    new_password = serializers.CharField(write_only=True, required=False)
    confirm_password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = user
        fields = ['first_name', 'last_name', 'profile_picture', 'is_student', 'is_instructor', 
                  'current_password', 'new_password', 'confirm_password']
        read_only_fields = ['is_student', 'is_instructor']

    def validate_new_password(self, value):
        # التحقق من قواعد كلمة المرور
        if value and len(value) < 8:
            raise serializers.ValidationError("كلمة المرور يجب أن تكون 8 أحرف على الأقل.")
        if value and not re.search(r'[A-Z]', value):
            raise serializers.ValidationError("كلمة المرور يجب أن تحتوي على حرف كبير واحد على الأقل.")
        if value and not re.search(r'[a-z]', value):
            raise serializers.ValidationError("كلمة المرور يجب أن تحتوي على حرف صغير واحد على الأقل.")
        if value and not re.search(r'\d', value):
            raise serializers.ValidationError("كلمة المرور يجب أن تحتوي على رقم واحد على الأقل.")
        if value and not re.search(r'[^A-Za-z0-9]', value):
            raise serializers.ValidationError("كلمة المرور يجب أن تحتوي على رمز خاص واحد على الأقل.")
        return value

    def validate(self, data):
        # التحقق من كلمات المرور إذا تم إرسالها
        current_password = data.get('current_password')
        new_password = data.get('new_password')
        confirm_password = data.get('confirm_password')

        if new_password or confirm_password or current_password:
            # التأكد من إرسال جميع الحقول الثلاثة
            if not (current_password and new_password and confirm_password):
                raise serializers.ValidationError("يجب إدخال كلمة المرور الحالية، الجديدة، وتأكيد الجديدة.")
            
            # التحقق من تطابق كلمة المرور الجديدة وتأكيدها
            if new_password != confirm_password:
                raise serializers.ValidationError("كلمات المرور الجديدة غير متطابقة.")
            
            # التحقق من كلمة المرور الحالية
            user_instance = self.context['request'].user
            if not user_instance.check_password(current_password):
                raise serializers.ValidationError({'current_password': 'كلمة المرور الحالية غير صحيحة.'})
            
            # التحقق من أن كلمة المرور الجديدة مختلفة عن الحالية
            if current_password == new_password:
                raise serializers.ValidationError("كلمة المرور الجديدة يجب أن تكون مختلفة عن الحالية.")
            
            # التحقق من قواعد كلمة المرور الجديدة
            self.validate_new_password(new_password)

        return data

    def update(self, instance, validated_data):
        # إزالة حقول كلمة المرور من البيانات قبل تحديث المستخدم
        current_password = validated_data.pop('current_password', None)
        new_password = validated_data.pop('new_password', None)
        confirm_password = validated_data.pop('confirm_password', None)

        # تحديث بقية الحقول
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # تحديث كلمة المرور إذا تم إرسالها
        if new_password:
            instance.set_password(new_password)
            instance.save()

        return instance

class ChangePasswordSerializer(serializers.Serializer):
    current_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    def validate_new_password(self, value):
        if len(value) < 8:
            raise serializers.ValidationError("Password must be at least 8 characters long.")
        if not re.search(r'[A-Z]', value):
            raise serializers.ValidationError("Password must contain at least one uppercase letter.")
        if not re.search(r'[a-z]', value):
            raise serializers.ValidationError("Password must contain at least one lowercase letter.")
        if not re.search(r'\d', value):
            raise serializers.ValidationError("Password must contain at least one digit.")
        if not re.search(r'[^A-Za-z0-9]', value):
            raise serializers.ValidationError("Password must contain at least one special character.")
        return value

    def validate(self, data):
        user_instance = self.context['request'].user
        if not user_instance.check_password(data['current_password']):
            raise serializers.ValidationError({'current_password': 'Current password is incorrect.'})
        if data['new_password'] != data['confirm_password']:
            raise serializers.ValidationError({'confirm_password': 'New passwords do not match.'})
        if data['current_password'] == data['new_password']:
            raise serializers.ValidationError({'new_password': 'New password must be different from the current password.'})
        self.validate_new_password(data['new_password'])
        return data

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = user
        fields = ['id', 'first_name', 'last_name', 'email', 'phone', 'profile_picture']

class InstructorProfileSerializer(serializers.ModelSerializer):
    user = UserProfileSerializer(read_only=True)
    
    class Meta:
        model = Instructor
        fields = [
            'id', 'user', 'phone_number', 'bio',
            'expertise', 'profile_pic'
        ]

class StudentProfileSerializer(serializers.ModelSerializer):
    user = UserProfileSerializer(read_only=True)
    
    class Meta:
        model = Student
        fields = [
            'id', 'user', 'phone', 'profile_pic'
        ]
        read_only_fields = ['id', 'user']

class AdminProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = user
        fields = [
            'id', 'first_name', 'last_name', 'email', 'phone',
            'role', 'profile_picture'
        ]


