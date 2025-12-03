from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework import status, generics, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from django.core.mail import send_mail, EmailMultiAlternatives
from django.conf import settings
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.urls import reverse
from django.shortcuts import render
from datetime import datetime
from .serializers import (
    CustomTokenObtainPairSerializer,
    UserRegistrationSerializer,
    UserProfileSerializer,
    PasswordResetRequestSerializer,
    PasswordResetConfirmSerializer
)
from portfolio.models import UserProfile
import secrets
import logging

logger = logging.getLogger(__name__)

User = get_user_model()


def send_approval_email(user, is_approved):
    """Send email notification when user account is approved or rejected"""
    # print(f"\n{'='*70}")
    # print(f"SEND_APPROVAL_EMAIL CALLED")
    # print(f"User: {user.username} (ID: {user.id})")
    # print(f"Email: {user.email}")
    # print(f"Is Approved: {is_approved}")
    # print(f"{'='*70}\n")
    
    try:
        logger.info(f"send_approval_email called for user: {user.username} (ID: {user.id}), email: {user.email}, is_approved: {is_approved}")
        
        # Validate user email exists
        if not user.email:
            # print(f"ERROR: User {user.username} has no email address\n")
            logger.error(f"Cannot send approval email: User {user.username} (ID: {user.id}) has no email address")
            return False
        
        # Use frontend URL for login link
        frontend_url = getattr(settings, 'FRONTEND_URL', 'http://localhost:3000')
        login_url = f"{frontend_url}/login"
        current_year = datetime.now().year
        
        if is_approved:
            subject = 'Your Portfy Account Has Been Approved!'
            template = 'email/account_approved.html'
        else:
            subject = 'Portfy Account Review Update'
            template = 'email/account_rejected.html'
        
        logger.info(f"Rendering email template: {template} for user: {user.email}")
        
        # Render the email template
        try:
            html_message = render_to_string(template, {
                'user': user,
                'login_url': login_url,
                'current_year': current_year,
            })
            logger.debug(f"Email template rendered successfully")
        except Exception as e:
            logger.error(f"Failed to render email template {template}: {str(e)}", exc_info=True)
            return False
        
        # Check email settings
        from_email = settings.DEFAULT_FROM_EMAIL
        plain_message = strip_tags(html_message)
        logger.info(f"Email settings - From: {from_email}, To: {user.email}, Subject: {subject}")
        
        # Use send_mail (same as working verification emails) instead of EmailMultiAlternatives
        # print(f"Sending email...")
        # print(f"From: {from_email}")
        # print(f"To: {user.email}")
        # print(f"Subject: {subject}\n")
        
        logger.info(f"Attempting to send email to {user.email} using send_mail...")
        try:
            send_mail(
                subject=subject,
                message=plain_message,
                from_email=from_email,
                recipient_list=[user.email],
                html_message=html_message,
                fail_silently=False,  # Raise exception if email fails
            )
            # print(f"✓✓✓ EMAIL SENT SUCCESSFULLY TO {user.email} ✓✓✓\n")
            logger.info(f"✓ Approval email sent successfully to {user.email} - Approved: {is_approved}, Subject: {subject}")
            return True
        except Exception as send_error:
            # print(f"✗✗✗ ERROR IN send_mail: {str(send_error)} ✗✗✗\n")
            import traceback
            # print(traceback.format_exc())
            logger.error(f"✗ send_mail raised exception: {str(send_error)}", exc_info=True)
            raise  # Re-raise to be caught by outer try-except
        
    except Exception as e:
        # print(f"\n✗✗✗ EXCEPTION IN send_approval_email ✗✗✗")
        # print(f"Error: {str(e)}")
        import traceback
        # print(traceback.format_exc())
        # print(f"✗✗✗ END EXCEPTION ✗✗✗\n")
        
        logger.error(f"✗ Error sending approval email to {user.email}: {str(e)}", exc_info=True)
        logger.error(f"Full traceback: {traceback.format_exc()}")
        return False


def send_portfolio_status_email(user, is_published, unpublished_by_admin=False):
    """Send email notification when portfolio is published or unpublished"""
    # print(f"\n{'='*70}")
    # print(f"SEND_PORTFOLIO_STATUS_EMAIL CALLED")
    # print(f"User: {user.username} (ID: {user.id})")
    # print(f"Email: {user.email}")
    # print(f"Is Published: {is_published}")
    # print(f"Unpublished by Admin: {unpublished_by_admin}")
    # print(f"{'='*70}\n")
    
    try:
        logger.info(f"send_portfolio_status_email called for user: {user.username} (ID: {user.id}), email: {user.email}, is_published: {is_published}")
        
        # Validate user email exists
        if not user.email:
            # print(f"ERROR: User {user.username} has no email address\n")
            logger.error(f"Cannot send portfolio status email: User {user.username} (ID: {user.id}) has no email address")
            return False
        
        # Use frontend URL for links
        frontend_url = getattr(settings, 'FRONTEND_URL', 'http://localhost:3000')
        dashboard_url = f"{frontend_url}/dashboard"
        current_year = datetime.now().year
        
        # Get profile to get username_slug
        try:
            profile = UserProfile.objects.get(user=user)
            portfolio_url = f"{frontend_url}/{profile.username_slug}" if profile.username_slug else None
        except UserProfile.DoesNotExist:
            portfolio_url = None
        
        if is_published:
            subject = 'Your Portfolio is Now Live! - Portfy'
            template = 'email/portfolio_published.html'
            context = {
                'user': user,
                'portfolio_url': portfolio_url or dashboard_url,
                'current_year': current_year,
            }
        else:
            subject = 'Your Portfolio Has Been Unpublished - Portfy'
            template = 'email/portfolio_unpublished.html'
            context = {
                'user': user,
                'dashboard_url': dashboard_url,
                'unpublished_by_admin': unpublished_by_admin,
                'current_year': current_year,
            }
        
        logger.info(f"Rendering email template: {template} for user: {user.email}")
        
        # Render the email template
        try:
            html_message = render_to_string(template, context)
            logger.debug(f"Email template rendered successfully")
        except Exception as e:
            logger.error(f"Failed to render email template {template}: {str(e)}", exc_info=True)
            return False
        
        # Check email settings
        from_email = settings.DEFAULT_FROM_EMAIL
        plain_message = strip_tags(html_message)
        logger.info(f"Email settings - From: {from_email}, To: {user.email}, Subject: {subject}")
        
        # Use send_mail (same as working verification emails)
        # print(f"Sending email...")
        # print(f"From: {from_email}")
        # print(f"To: {user.email}")
        # print(f"Subject: {subject}\n")
        
        logger.info(f"Attempting to send email to {user.email} using send_mail...")
        try:
            send_mail(
                subject=subject,
                message=plain_message,
                from_email=from_email,
                recipient_list=[user.email],
                html_message=html_message,
                fail_silently=False,  # Raise exception if email fails
            )
            # print(f"✓✓✓ EMAIL SENT SUCCESSFULLY TO {user.email} ✓✓✓\n")
            logger.info(f"✓ Portfolio status email sent successfully to {user.email} - Published: {is_published}, Subject: {subject}")
            return True
        except Exception as send_error:
            # print(f"✗✗✗ ERROR IN send_mail: {str(send_error)} ✗✗✗\n")
            import traceback
            # print(traceback.format_exc())
            logger.error(f"✗ send_mail raised exception: {str(send_error)}", exc_info=True)
            raise  # Re-raise to be caught by outer try-except
        
    except Exception as e:
        # print(f"\n✗✗✗ EXCEPTION IN send_portfolio_status_email ✗✗✗")
        # print(f"Error: {str(e)}")
        import traceback
        # print(traceback.format_exc())
        # print(f"✗✗✗ END EXCEPTION ✗✗✗\n")
        
        logger.error(f"✗ Error sending portfolio status email to {user.email}: {str(e)}", exc_info=True)
        logger.error(f"Full traceback: {traceback.format_exc()}")
        return False


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class RegisterView(generics.CreateAPIView):
    """User registration endpoint"""
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # Send verification email
        try:
            # Refresh profile from database to ensure we have the latest token
            profile = UserProfile.objects.get(user=user)
            
            # Ensure token exists (should be set by serializer, but double-check)
            if not profile.email_verification_token:
                profile.email_verification_token = secrets.token_urlsafe(32)
                profile.save()
            
            # Verify token is not None before building URL
            if profile.email_verification_token:
                # Use frontend URL for verification link
                frontend_url = getattr(settings, 'FRONTEND_URL', 'http://localhost:3000')
                verification_url = f"{frontend_url}/verify-email/{profile.email_verification_token}"
            else:
                raise ValueError("Email verification token is None")
            
            html_message = render_to_string('email/verification.html', {
                'user': user,
                'verification_url': verification_url,
                'frontend_url': frontend_url,
            })
            plain_message = strip_tags(html_message)
            
            send_mail(
                subject='Verify Your Email - Portfy',
                message=plain_message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[user.email],
                html_message=html_message,
                fail_silently=False,
            )
        except Exception as e:
            # Log error but don't fail registration
            logger.error(f"Failed to send verification email: {str(e)}", exc_info=True)
        
        return Response({
            'message': 'Registration successful! Please check your email to verify your account.',
            'user_id': user.id,
        }, status=status.HTTP_201_CREATED)


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def verify_email(request, token):
    """Verify user email - returns JSON for API calls, HTML for direct browser access"""
    from urllib.parse import unquote
    
    frontend_url = getattr(settings, 'FRONTEND_URL', 'http://localhost:3000')
    
    # Check if this is an API call (Accept: application/json)
    is_api_call = request.META.get('HTTP_ACCEPT', '').startswith('application/json')
    
    # URL decode the token in case it was encoded
    token = unquote(token)
    
    # Log the token for debugging
    logger.info(f"Email verification attempt - Token: {token[:20]}..., Is API call: {is_api_call}")
    
    # Check if token is None or empty
    if not token or token == 'None' or token.lower() == 'none':
        logger.warning(f"Empty or None token received")
        if is_api_call:
            return Response({
                'error': 'Invalid or expired verification token.'
            }, status=status.HTTP_400_BAD_REQUEST)
        return render(request, 'email/verification_failed.html', {
            'frontend_url': frontend_url
        }, status=400)
    
    try:
        # Try to find the profile with this token
        profile = UserProfile.objects.get(email_verification_token=token)
        logger.info(f"Token found for user: {profile.user.username}")
        
        # Check if email is already verified
        if profile.email_verified:
            logger.info(f"Email already verified for user: {profile.user.username}")
            if is_api_call:
                return Response({
                    'message': 'Your email has already been verified. You can proceed to login.'
                }, status=status.HTTP_200_OK)
            return render(request, 'email/verification_success.html', {
                'frontend_url': frontend_url
            }, status=200)
        
        # Set email as verified
        profile.email_verified = True
        profile.email_verification_token = None  # Clear token after verification
        profile.save(update_fields=['email_verified', 'email_verification_token'])
        
        # Verify the save worked
        profile.refresh_from_db()
        if not profile.email_verified:
            logger.error(f"Failed to save email_verified=True for user: {profile.user.username}")
            raise Exception("Failed to update email verification status")
        
        logger.info(f"Email verified successfully for user: {profile.user.username} - email_verified={profile.email_verified}")
        
        if is_api_call:
            return Response({
                'message': 'Email verified successfully! Your account is pending admin approval.'
            }, status=status.HTTP_200_OK)
        
        return render(request, 'email/verification_success.html', {
            'frontend_url': frontend_url
        }, status=200)
    except UserProfile.DoesNotExist:
        logger.warning(f"Token not found in database: {token[:20]}...")
        
        # Token doesn't exist - this could mean:
        # 1. Token was already used (email should be verified)
        # 2. Token never existed or expired (email not verified)
        
        # Try to find if there's a user with this email that's already verified
        # We can't match by token, but we can check recently verified users
        # However, a better approach: Check if there are any users verified in the last hour
        # But we can't identify which user without the token...
        
        # Actually, the best approach: Since the token was cleared after verification,
        # if someone clicks the link again, their email is likely already verified.
        # We should return a helpful message suggesting they check their status or try logging in.
        # But we can't guarantee it, so we'll return a message that's helpful but not misleading.
        
        if is_api_call:
            return Response({
                'message': 'This verification link has already been used. If your email was successfully verified, you can proceed to login. If not, please contact support.',
                'already_used': True,
                'suggestion': 'Try logging in to check if your email is verified.'
            }, status=status.HTTP_200_OK)
        return render(request, 'email/verification_success.html', {
            'frontend_url': frontend_url,
            'message': 'This verification link has already been used. If your email was successfully verified, you can proceed to login.'
        }, status=200)
    except Exception as e:
        logger.error(f"Error verifying email: {str(e)}", exc_info=True)
        if is_api_call:
            return Response({
                'error': 'An error occurred while verifying your email. Please try again later.'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return render(request, 'email/verification_failed.html', {
            'frontend_url': frontend_url
        }, status=500)


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def password_reset_request(request):
    """Request password reset"""
    serializer = PasswordResetRequestSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    email = serializer.validated_data['email']
    
    try:
        user = User.objects.get(email=email)
        profile = user.profile
        
        # Generate reset token
        reset_token = secrets.token_urlsafe(32)
        profile.email_verification_token = reset_token  # Reuse this field for reset token
        profile.save()
        
        # Send reset email - use frontend URL
        frontend_url = getattr(settings, 'FRONTEND_URL', 'http://localhost:3000')
        reset_url = f"{frontend_url}/reset-password/{reset_token}"

        html_message = render_to_string('email/password_reset.html', {
            'user': user,
            'reset_url': reset_url,
            'frontend_url': frontend_url,
        })
        plain_message = strip_tags(html_message)
        
        send_mail(
            subject='Password Reset - Portfy',
            message=plain_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            html_message=html_message,
            fail_silently=False,
        )
        
        return Response({
            'message': 'Password reset link has been sent to your email.',
        }, status=status.HTTP_200_OK)
    except User.DoesNotExist:
        # Don't reveal if email exists
        return Response({
            'message': 'If an account exists with this email, a password reset link has been sent.',
        }, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def password_reset_confirm(request, token):
    """Confirm password reset"""
    from urllib.parse import unquote
    
    # URL decode the token in case it was encoded
    token = unquote(token)
    
    logger.info(f"Password reset confirm attempt - Token: {token[:20] if token else 'None'}...")
    
    # Check if token is None or empty
    if not token or token == 'None' or token.lower() == 'none':
        logger.warning(f"Empty or None token received for password reset")
        return Response({
            'error': 'Invalid or expired reset token.',
        }, status=status.HTTP_400_BAD_REQUEST)
    
    serializer = PasswordResetConfirmSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    
    try:
        profile = UserProfile.objects.get(email_verification_token=token)
        user = profile.user
        
        # Set new password
        user.set_password(serializer.validated_data['new_password'])
        user.save()
        
        # Clear reset token
        profile.email_verification_token = None
        profile.save()
        
        logger.info(f"Password reset successful for user: {user.username} (ID: {user.id})")
        
        return Response({
            'message': 'Password reset successfully! You can now login with your new password.',
        }, status=status.HTTP_200_OK)
    except UserProfile.DoesNotExist:
        logger.warning(f"Password reset token not found: {token[:20]}...")
        return Response({
            'error': 'Invalid or expired reset token.',
        }, status=status.HTTP_400_BAD_REQUEST)


class UserProfileView(generics.RetrieveUpdateAPIView):
    """Get or update current user's profile"""
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        profile, created = UserProfile.objects.get_or_create(user=self.request.user)
        return profile

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def current_user(request):
    """Get current authenticated user info"""
    profile, created = UserProfile.objects.get_or_create(user=request.user)
    serializer = UserProfileSerializer(profile, context={'request': request})
    data = serializer.data
    # Add user role information
    data['is_staff'] = request.user.is_staff
    data['is_superuser'] = request.user.is_superuser
    data['username'] = request.user.username
    data['email'] = request.user.email
    return Response(data)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def list_users(request):
    """List all users with pagination (staff/superuser only)"""
    if not (request.user.is_staff or request.user.is_superuser):
        return Response(
            {'error': 'You do not have permission to view all users.'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    from django.contrib.auth import get_user_model
    from math import ceil
    User = get_user_model()
    
    # Allowed page sizes
    ALLOWED_PAGE_SIZES = [10, 30, 50, 70, 100]
    
    # Get pagination parameters
    try:
        page = int(request.GET.get('page', 1))
        if page < 1:
            page = 1
    except (ValueError, TypeError):
        page = 1
    
    try:
        page_size = int(request.GET.get('page_size', 30))
        if page_size not in ALLOWED_PAGE_SIZES:
            return Response(
                {
                    'error': f'Invalid page_size. Allowed values are: {", ".join(map(str, ALLOWED_PAGE_SIZES))}'
                },
                status=status.HTTP_400_BAD_REQUEST
            )
    except (ValueError, TypeError):
        page_size = 30
    
    # Get all users
    users_queryset = User.objects.all().order_by('-date_joined')
    total_users = users_queryset.count()
    
    # Calculate pagination
    total_pages = ceil(total_users / page_size) if total_users > 0 else 1
    
    # Ensure page is within valid range
    if page > total_pages and total_pages > 0:
        page = total_pages
    
    has_next = page < total_pages
    has_previous = page > 1
    
    # Apply pagination
    start_index = (page - 1) * page_size
    end_index = start_index + page_size
    paginated_users = users_queryset[start_index:end_index]
    
    # Serialize users
    user_data = []
    for user in paginated_users:
        try:
            profile = user.profile
        except UserProfile.DoesNotExist:
            profile = UserProfile.objects.create(user=user)
        
        user_data.append({
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'is_staff': user.is_staff,
            'is_superuser': user.is_superuser,
            'is_active': user.is_active,
            'date_joined': user.date_joined,
            'profile': {
                'id': profile.id,
                'is_approved': profile.is_approved,
                'email_verified': profile.email_verified,
                'portfolio_published': profile.portfolio_published,
                'username_slug': profile.username_slug,
            }
        })
    
    return Response({
        'results': user_data,
        'total_users': total_users,
        'page': page,
        'page_size': page_size,
        'total_pages': total_pages,
        'has_next': has_next,
        'has_previous': has_previous,
    })


@api_view(['PATCH'])
@permission_classes([permissions.IsAuthenticated])
def update_user_approval(request, user_id):
    """Update user approval status (staff/superuser only)"""
    # print(f"\n{'='*70}")
    # print(f"UPDATE_USER_APPROVAL CALLED")
    # print(f"User ID: {user_id}")
    # print(f"Request User: {request.user.username}")
    # print(f"Is Staff: {request.user.is_staff}, Is Superuser: {request.user.is_superuser}")
    # print(f"Request Data: {request.data}")
    # print(f"{'='*70}\n")
    
    if not (request.user.is_staff or request.user.is_superuser):
        return Response(
            {'error': 'You do not have permission to update user approval.'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    from django.contrib.auth import get_user_model
    User = get_user_model()
    
    try:
        user = User.objects.get(id=user_id)
        # Don't allow modifying staff/superuser approval
        if user.is_staff or user.is_superuser:
            return Response(
                {'error': 'Cannot modify approval status for staff or superuser accounts.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        profile, created = UserProfile.objects.get_or_create(user=user)
        is_approved = request.data.get('is_approved', None)
        
        if is_approved is not None:
            old_status = profile.is_approved
            new_status = bool(is_approved)
            
            # Update the approval status
            profile.is_approved = new_status
            
            # Save the profile - use update_fields to avoid triggering unnecessary signals
            # This is more efficient and avoids potential signal issues
            try:
                profile.save(update_fields=['is_approved', 'updated_at'])
            except Exception as save_error:
                logger.error(f"Error saving profile: {str(save_error)}", exc_info=True)
                import traceback
                # print(f"\n✗✗✗ ERROR SAVING PROFILE ✗✗✗")
                # print(f"Error: {str(save_error)}")
                # print(traceback.format_exc())
                # print(f"✗✗✗ END ERROR ✗✗✗\n")
                # Re-raise to be caught by outer exception handler
                raise
            
            # ALWAYS send email notification when status is set (regardless of whether it changed)
            # print(f"Preparing to send approval email...")
            # print(f"User: {user.username}, Email: {user.email}")
            # print(f"New Status: {new_status}, Old Status: {old_status}\n")
            
            logger.info(f"Preparing to send approval email - User: {user.username}, Email: {user.email}, New Status: {new_status}, Old Status: {old_status}")
            try:
                email_sent = send_approval_email(user, new_status)
                if email_sent:
                    # print(f"✓ Email function returned True\n")
                    logger.info(f"✓ Approval email sent successfully to {user.email} - Status: {new_status} (was: {old_status})")
                else:
                    # print(f"✗ Email function returned False\n")
                    logger.error(f"✗ Approval email function returned False for {user.email} - Status: {new_status}. Check logs above for details.")
            except Exception as e:
                # print(f"\n✗✗✗ EXCEPTION IN EMAIL SENDING ✗✗✗")
                # print(f"Error: {str(e)}")
                import traceback
                # print(traceback.format_exc())
                # print(f"✗✗✗ END EXCEPTION ✗✗✗\n")
                
                logger.error(f"✗ Exception sending approval email to {user.email}: {str(e)}", exc_info=True)
                logger.error(f"Full traceback: {traceback.format_exc()}")
                # Don't fail the request if email fails, but log it
            
            # Refresh profile from database to ensure we have the latest data
            try:
                profile.refresh_from_db()
            except Exception as refresh_error:
                logger.warning(f"Could not refresh profile from DB: {str(refresh_error)}")
                # Continue anyway - we have the data we need
            
            # Prepare response data
            try:
                response_data = {
                    'success': True,
                    'message': f'User {"approved" if profile.is_approved else "revoked"} successfully.',
                    'is_approved': bool(profile.is_approved)
                }
                # print(f"Returning response: {response_data}\n")
                return Response(response_data, status=status.HTTP_200_OK)
            except Exception as response_error:
                logger.error(f"Error creating response: {str(response_error)}", exc_info=True)
                import traceback
                # print(f"\n✗✗✗ ERROR CREATING RESPONSE ✗✗✗")
                # print(f"Error: {str(response_error)}")
                # print(traceback.format_exc())
                # print(f"✗✗✗ END ERROR ✗✗✗\n")
                # Return a simple response as fallback
                return Response({
                    'success': True,
                    'message': 'User status updated successfully.',
                    'is_approved': new_status
                }, status=status.HTTP_200_OK)
        else:
            return Response(
                {'error': 'is_approved field is required.'},
                status=status.HTTP_400_BAD_REQUEST
            )
    except User.DoesNotExist:
        logger.error(f"User with ID {user_id} not found")
        return Response(
            {'error': 'User not found.'},
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        # print(f"\n✗✗✗ UNEXPECTED ERROR IN update_user_approval ✗✗✗")
        # print(f"Error: {str(e)}")
        import traceback
        # print(traceback.format_exc())
        # print(f"✗✗✗ END ERROR ✗✗✗\n")
        
        logger.error(f"Unexpected error in update_user_approval: {str(e)}", exc_info=True)
        logger.error(f"Full traceback: {traceback.format_exc()}")
        return Response(
            {'error': f'An error occurred: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['PATCH'])
@permission_classes([permissions.IsAuthenticated])
def update_user_status(request, user_id):
    """Activate or deactivate a user (staff/superuser only)"""
    if not (request.user.is_staff or request.user.is_superuser):
        return Response(
            {'error': 'You do not have permission to update user status.'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    from django.contrib.auth import get_user_model
    User = get_user_model()
    
    try:
        user = User.objects.get(id=user_id)
        # Don't allow deactivating yourself
        if user.id == request.user.id:
            return Response(
                {'error': 'You cannot deactivate your own account.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        is_active = request.data.get('is_active', None)
        
        if is_active is not None:
            user.is_active = bool(is_active)
            user.save()
            
            return Response({
                'success': True,
                'message': f'User {"activated" if user.is_active else "deactivated"} successfully.',
                'is_active': user.is_active
            })
        else:
            return Response(
                {'error': 'is_active field is required.'},
                status=status.HTTP_400_BAD_REQUEST
            )
    except User.DoesNotExist:
        return Response(
            {'error': 'User not found.'},
            status=status.HTTP_404_NOT_FOUND
        )


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def user_profile_detail(request, user_id):
    """Get complete user profile with all portfolio data (staff/superuser only)"""
    if not (request.user.is_staff or request.user.is_superuser):
        return Response(
            {'error': 'You do not have permission to view user profiles.'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    from django.contrib.auth import get_user_model
    User = get_user_model()
    
    try:
        user = User.objects.get(id=user_id)
        profile, created = UserProfile.objects.get_or_create(user=user)
        
        # Get all portfolio data for this user
        from portfolio.models import AboutMe, Project, Experience, Education, Skill, SocialMedia, ContactMessage
        from portfolio.serializers import (
            AboutMeSerializer, ProjectSerializer, ExperienceSerializer,
            EducationSerializer, SkillSerializer, SocialMediaSerializer,
            ContactMessageSerializer
        )
        
        user_data = {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'is_staff': user.is_staff,
            'is_superuser': user.is_superuser,
            'is_active': user.is_active,
            'date_joined': user.date_joined,
            'profile': UserProfileSerializer(profile, context={'request': request}).data,
            'about_me': None,
            'projects': [],
            'experiences': [],
            'educations': [],
            'skills': [],
            'social_media': [],
            'messages': [],
        }
        
        # Get About Me
        about_me = AboutMe.objects.filter(user=user).first()
        if about_me:
            user_data['about_me'] = AboutMeSerializer(about_me, context={'request': request}).data
        
        # Get Projects
        projects = Project.objects.filter(user=user)
        user_data['projects'] = ProjectSerializer(projects, many=True, context={'request': request}).data
        
        # Get Experiences
        experiences = Experience.objects.filter(user=user)
        user_data['experiences'] = ExperienceSerializer(experiences, many=True, context={'request': request}).data
        
        # Get Educations
        educations = Education.objects.filter(user=user)
        user_data['educations'] = EducationSerializer(educations, many=True, context={'request': request}).data
        
        # Get Skills
        skills = Skill.objects.filter(user=user)
        user_data['skills'] = SkillSerializer(skills, many=True, context={'request': request}).data
        
        # Get Social Media
        social_media = SocialMedia.objects.filter(user=user)
        user_data['social_media'] = SocialMediaSerializer(social_media, many=True, context={'request': request}).data
        
        # Get Messages sent to this user
        messages = ContactMessage.objects.filter(user=user).order_by('-created_at')
        user_data['messages'] = ContactMessageSerializer(messages, many=True, context={'request': request}).data
        
        return Response(user_data)
    except User.DoesNotExist:
        return Response(
            {'error': 'User not found.'},
            status=status.HTTP_404_NOT_FOUND
        )


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def system_overview(request):
    """Get system overview statistics (staff/superuser only)"""
    if not (request.user.is_staff or request.user.is_superuser):
        return Response(
            {'error': 'You do not have permission to view system overview.'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    from django.contrib.auth import get_user_model
    User = get_user_model()
    from portfolio.models import AboutMe, Project, Experience, Education, Skill, ContactMessage
    
    stats = {
        'total_users': User.objects.count(),
        'active_users': User.objects.filter(is_active=True).count(),
        'approved_users': UserProfile.objects.filter(is_approved=True).count(),
        'pending_users': UserProfile.objects.filter(is_approved=False).count(),
        'staff_users': User.objects.filter(is_staff=True).count(),
        'superusers': User.objects.filter(is_superuser=True).count(),
        'total_projects': Project.objects.count(),
        'total_experiences': Experience.objects.count(),
        'total_educations': Education.objects.count(),
        'total_skills': Skill.objects.count(),
        'total_about_me': AboutMe.objects.count(),
        'total_messages': ContactMessage.objects.count(),
        'new_messages': ContactMessage.objects.filter(status='new').count(),
        'read_messages': ContactMessage.objects.filter(status='read').count(),
        'replied_messages': ContactMessage.objects.filter(status='replied').count(),
    }
    
    return Response(stats)


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def create_message_for_user(request, username_slug):
    """Create a contact message for a specific user's portfolio"""
    from portfolio.models import ContactMessage
    from portfolio.serializers import ContactMessageCreateSerializer
    from portfolio.models import UserProfile
    from django.contrib.auth import get_user_model
    User = get_user_model()
    
    try:
        # Find the user by username_slug
        try:
            profile = UserProfile.objects.get(username_slug=username_slug)
            user = profile.user
        except UserProfile.DoesNotExist:
            # Try to find by username as fallback
            try:
                user = User.objects.get(username=username_slug)
            except User.DoesNotExist:
                return Response({
                    'error': f'Portfolio not found for username: {username_slug}',
                }, status=status.HTTP_404_NOT_FOUND)
        
        # Check if portfolio is published
        profile, _ = UserProfile.objects.get_or_create(user=user)
        if not profile.portfolio_published:
            return Response({
                'error': 'Portfolio is not published.',
            }, status=status.HTTP_403_FORBIDDEN)
        
        # Create the message with the user assigned
        serializer = ContactMessageCreateSerializer(data=request.data)
        if serializer.is_valid():
            message = serializer.save(user=user, status='new')
            return Response(ContactMessageCreateSerializer(message).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        import logging
        logger = logging.getLogger(__name__)
        logger.error(f"Error creating message: {str(e)}", exc_info=True)
        return Response({
            'error': f'An error occurred while creating message: {str(e)}',
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def portfolio_by_username(request, username_slug):
    """Get portfolio data by username slug"""
    import logging
    logger = logging.getLogger(__name__)
    
    logger.info(f"Fetching portfolio for username_slug: {username_slug}")
    
    try:
        # First check if profile exists (even if not published)
        try:
            profile = UserProfile.objects.get(username_slug=username_slug)
            logger.info(f"Profile found: {profile.user.username}, published: {profile.portfolio_published}")
        except UserProfile.DoesNotExist:
            logger.warning(f"Profile not found for username_slug: {username_slug}")
            # Try to find by username as fallback
            from django.contrib.auth import get_user_model
            User = get_user_model()
            try:
                user = User.objects.get(username=username_slug)
                profile, created = UserProfile.objects.get_or_create(user=user)
                logger.info(f"Found user by username, created profile: {created}")
            except User.DoesNotExist:
                return Response({
                    'error': f'Portfolio not found for username: {username_slug}',
                }, status=status.HTTP_404_NOT_FOUND)
        
        # Check if portfolio is published
        if not profile.portfolio_published:
            logger.warning(f"Portfolio not published for user: {profile.user.username}")
            return Response({
                'error': 'Portfolio is not published. Please publish it from your dashboard.',
                'username_slug': profile.username_slug,
                'portfolio_published': False,
            }, status=status.HTTP_403_FORBIDDEN)
        
        user = profile.user
        logger.info(f"Fetching portfolio data for user: {user.username} (ID: {user.id})")
        
        # Get all portfolio data for this user
        from portfolio.serializers import (
            AboutMeSerializer, ProjectSerializer, ExperienceSerializer,
            EducationSerializer, SkillSerializer, SocialMediaSerializer
        )
        from portfolio.models import AboutMe, Project, Experience, Education, Skill, SocialMedia
        
        portfolio_data = {
            'profile': UserProfileSerializer(profile, context={'request': request}).data,
            'about_me': None,
            'projects': [],
            'experiences': [],
            'educations': [],
            'skills': [],
            'social_media': [],
        }
        
        # Get About Me
        about_me = AboutMe.objects.filter(user=user).first()
        logger.info(f"About Me found: {about_me is not None}")
        if about_me:
            portfolio_data['about_me'] = AboutMeSerializer(about_me, context={'request': request}).data
            logger.info(f"About Me data: name={about_me.name}, title={about_me.title}")
        
        # Get Projects
        projects = Project.objects.filter(user=user)
        logger.info(f"Projects found: {projects.count()}")
        portfolio_data['projects'] = ProjectSerializer(projects, many=True, context={'request': request}).data
        
        # Get Experiences
        experiences = Experience.objects.filter(user=user)
        logger.info(f"Experiences found: {experiences.count()}")
        portfolio_data['experiences'] = ExperienceSerializer(experiences, many=True, context={'request': request}).data
        
        # Get Educations
        educations = Education.objects.filter(user=user)
        logger.info(f"Educations found: {educations.count()}")
        portfolio_data['educations'] = EducationSerializer(educations, many=True, context={'request': request}).data
        
        # Get Skills
        skills = Skill.objects.filter(user=user)
        logger.info(f"Skills found: {skills.count()}")
        portfolio_data['skills'] = SkillSerializer(skills, many=True, context={'request': request}).data
        
        # Get Social Media
        social_media = SocialMedia.objects.filter(user=user)
        logger.info(f"Social Media found: {social_media.count()}")
        portfolio_data['social_media'] = SocialMediaSerializer(social_media, many=True, context={'request': request}).data
        
        logger.info(f"Returning portfolio data for {user.username}")
        return Response(portfolio_data, status=status.HTTP_200_OK)
    except Exception as e:
        logger.error(f"Error fetching portfolio: {str(e)}", exc_info=True)
        return Response({
            'error': f'An error occurred while fetching portfolio: {str(e)}',
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
