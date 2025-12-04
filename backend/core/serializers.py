from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import authenticate
from django.contrib.auth import get_user_model
from rest_framework import serializers
from rest_framework_simplejwt.exceptions import AuthenticationFailed
from rest_framework_simplejwt.settings import api_settings
import secrets

User = get_user_model()


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = 'username_or_email'

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Replace username field with username_or_email
        if 'username' in self.fields:
            self.fields.pop('username')
        self.fields['username_or_email'] = serializers.CharField(write_only=True)

    def validate(self, attrs):
        username_or_email = attrs.get('username_or_email')
        password = attrs.get('password')

        if not username_or_email or not password:
            raise serializers.ValidationError(
                'Must include "username_or_email" and "password".'
            )

        # Check if input is an email
        if '@' in username_or_email:
            try:
                user = User.objects.get(email=username_or_email)
                username = user.username
            except User.DoesNotExist:
                raise AuthenticationFailed(
                    'No active account found with the given credentials.',
                    'no_active_account',
                )
        else:
            username = username_or_email

        # Authenticate with username
        authenticate_kwargs = {
            'username': username,
            'password': password,
        }
        try:
            authenticate_kwargs['request'] = self.context['request']
        except KeyError:
            pass

        self.user = authenticate(**authenticate_kwargs)

        if not self.user:
            raise AuthenticationFailed(
                'No active account found with the given credentials.',
                'no_active_account',
            )

        # Check if user authentication rule passes
        if not api_settings.USER_AUTHENTICATION_RULE(self.user):
            raise AuthenticationFailed(
                'No active account found with the given credentials.',
                'no_active_account',
            )

        # Check email verification (for all users except super admins)
        if not self.user.is_superuser:
            from portfolio.models import UserProfile
            try:
                profile = self.user.profile
                if not profile.email_verified:
                    raise AuthenticationFailed(
                        'Please verify your email address before logging in. Check your inbox for the verification link.',
                        'email_not_verified',
                    )
            except UserProfile.DoesNotExist:
                raise AuthenticationFailed(
                    'Account not properly set up. Please contact support.',
                    'account_not_setup',
                )

        # Check if user is approved (for regular users)
        if not self.user.is_superuser and not self.user.is_staff:
            from portfolio.models import UserProfile
            try:
                profile = self.user.profile
                if not profile.is_approved:
                    raise AuthenticationFailed(
                        'Your account is pending approval. Please wait for admin approval.',
                        'account_pending_approval',
                    )
            except UserProfile.DoesNotExist:
                raise AuthenticationFailed(
                    'Account not properly set up. Please contact support.',
                    'account_not_setup',
                )

        # Generate tokens
        refresh = self.get_token(self.user)
        
        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'password_confirm', 'first_name', 'last_name')
        extra_kwargs = {
            'email': {'required': True},
            'first_name': {'required': False},
            'last_name': {'required': False},
        }

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({'password': 'Passwords do not match.'})
        return attrs

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError('A user with this email already exists.')
        return value

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError('A user with this username already exists.')
        return value

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')
        user = User.objects.create_user(**validated_data)
        user.set_password(password)
        user.is_active = True  # User is active but needs approval
        user.save()
        
        # Create or get UserProfile (signal might have already created it)
        from portfolio.models import UserProfile
        profile, created = UserProfile.objects.get_or_create(user=user)
        
        # Always generate a new email verification token
        profile.email_verification_token = secrets.token_urlsafe(32)
        profile.save(update_fields=['email_verification_token'])
        
        return user


class UserProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)
    first_name = serializers.CharField(source='user.first_name', read_only=True)
    last_name = serializers.CharField(source='user.last_name', read_only=True)
    banner_image = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = None  # Will be set dynamically
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'username_slug', 
                  'portfolio_published', 'is_approved', 'email_verified', 'banner_image',
                  'created_at', 'updated_at')
        read_only_fields = ('id', 'is_approved', 'email_verified', 'created_at', 'updated_at')

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        from portfolio.models import UserProfile
        self.Meta.model = UserProfile

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if representation.get('banner_image'):
            request = self.context.get('request')
            if request:
                image_path = representation['banner_image']
                if not image_path.startswith('http'):
                    if not image_path.startswith('/'):
                        image_path = f'/media/{image_path}'
                    representation['banner_image'] = request.build_absolute_uri(image_path)
        return representation


class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        if not User.objects.filter(email=value).exists():
            raise serializers.ValidationError('No account found with this email address.')
        return value


class PasswordResetConfirmSerializer(serializers.Serializer):
    new_password = serializers.CharField(min_length=8, write_only=True)
    new_password_confirm = serializers.CharField(min_length=8, write_only=True)

    def validate(self, attrs):
        if attrs['new_password'] != attrs['new_password_confirm']:
            raise serializers.ValidationError({'new_password': 'Passwords do not match.'})
        return attrs
