from django.urls import path
from .views import (
    RegisterView,
    verify_email_otp,
    resend_verification_otp,
    password_reset_request,
    password_reset_confirm,
    UserProfileView,
    current_user,
    list_users,
    update_user_approval,
    update_user_status,
    user_profile_detail,
    system_overview,
    create_message_for_user,
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('verify-email-otp/', verify_email_otp, name='verify-email-otp'),
    path('resend-verification-otp/', resend_verification_otp, name='resend-verification-otp'),
    path('password-reset/', password_reset_request, name='password-reset-request'),
    path('password-reset/<str:token>/', password_reset_confirm, name='password-reset-confirm'),
    path('profile/', UserProfileView.as_view(), name='user-profile'),
    path('me/', current_user, name='current-user'),
    path('users/', list_users, name='list-users'),
    path('users/<int:user_id>/approval/', update_user_approval, name='update-user-approval'),
    path('users/<int:user_id>/status/', update_user_status, name='update-user-status'),
    path('users/<int:user_id>/profile/', user_profile_detail, name='user-profile-detail'),
    path('system/overview/', system_overview, name='system-overview'),
    path('portfolio/<str:username_slug>/message/', create_message_for_user, name='create-message-for-user'),
]

