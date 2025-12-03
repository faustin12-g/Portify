from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
import logging
from .models import AboutMe, Project, Experience, Education, Skill, SocialMedia, ContactInfo, ContactMessage
from .serializers import (
    AboutMeSerializer,
    ProjectSerializer,
    ExperienceSerializer,
    EducationSerializer,
    SkillSerializer,
    SocialMediaSerializer,
    ContactInfoSerializer,
    ContactMessageSerializer,
    ContactMessageCreateSerializer
)


class AboutMeViewSet(viewsets.ModelViewSet):
    serializer_class = AboutMeSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        # Users can ONLY see their own data
        if self.request.user.is_authenticated:
            # Admins can see all, regular users see only their own
            if self.request.user.is_superuser or self.request.user.is_staff:
                return AboutMe.objects.all()
            return AboutMe.objects.filter(user=self.request.user)
        return AboutMe.objects.none()
    
    def perform_create(self, serializer):
        # Force user to be the current authenticated user
        if not self.request.user.is_authenticated:
            raise PermissionDenied("Authentication required")
        # Always set user from request - never trust frontend
        logger = logging.getLogger(__name__)
        logger.info(f"Creating AboutMe for user: {self.request.user.username} (ID: {self.request.user.id})")
        serializer.save(user=self.request.user)
    
    def perform_update(self, serializer):
        # Ensure user can only update their own records
        instance = self.get_object()
        if not (self.request.user.is_superuser or self.request.user.is_staff):
            if instance.user != self.request.user:
                raise PermissionDenied("You can only update your own records")
        # Never allow user field to be changed via update - always keep original user
        serializer.save(user=instance.user)
    
    def perform_destroy(self, instance):
        # Ensure user can only delete their own records
        if not (self.request.user.is_superuser or self.request.user.is_staff):
            if instance.user != self.request.user:
                raise PermissionDenied("You can only delete your own records")
        instance.delete()
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context


class ProjectViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        # Users can ONLY see their own data
        if self.request.user.is_authenticated:
            if self.request.user.is_superuser or self.request.user.is_staff:
                return Project.objects.all()
            return Project.objects.filter(user=self.request.user)
        return Project.objects.none()
    
    def perform_create(self, serializer):
        # Force user to be the current authenticated user
        if not self.request.user.is_authenticated:
            raise PermissionDenied("Authentication required")
        # Always set user from request - never trust frontend
        logger = logging.getLogger(__name__)
        logger.info(f"Creating Project for user: {self.request.user.username} (ID: {self.request.user.id})")
        serializer.save(user=self.request.user)
    
    def perform_update(self, serializer):
        instance = self.get_object()
        if not (self.request.user.is_superuser or self.request.user.is_staff):
            if instance.user != self.request.user:
                raise PermissionDenied("You can only update your own records")
        # Never allow user field to be changed via update - always keep original user
        serializer.save(user=instance.user)
    
    def perform_destroy(self, instance):
        if not (self.request.user.is_superuser or self.request.user.is_staff):
            if instance.user != self.request.user:
                raise PermissionDenied("You can only delete your own records")
        instance.delete()
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context


class ExperienceViewSet(viewsets.ModelViewSet):
    serializer_class = ExperienceSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        # Users can ONLY see their own data
        if self.request.user.is_authenticated:
            if self.request.user.is_superuser or self.request.user.is_staff:
                return Experience.objects.all()
            return Experience.objects.filter(user=self.request.user)
        return Experience.objects.none()
    
    def perform_create(self, serializer):
        if not self.request.user.is_authenticated:
            raise PermissionDenied("Authentication required")
        # Always set user from request - never trust frontend
        logger = logging.getLogger(__name__)
        logger.info(f"Creating {self.__class__.__name__.replace('ViewSet', '')} for user: {self.request.user.username} (ID: {self.request.user.id})")
        serializer.save(user=self.request.user)
    
    def perform_update(self, serializer):
        instance = self.get_object()
        if not (self.request.user.is_superuser or self.request.user.is_staff):
            if instance.user != self.request.user:
                raise PermissionDenied("You can only update your own records")
        # Never allow user field to be changed via update - always keep original user
        serializer.save(user=instance.user)
    
    def perform_destroy(self, instance):
        if not (self.request.user.is_superuser or self.request.user.is_staff):
            if instance.user != self.request.user:
                raise PermissionDenied("You can only delete your own records")
        instance.delete()


class EducationViewSet(viewsets.ModelViewSet):
    serializer_class = EducationSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        # Users can ONLY see their own data
        if self.request.user.is_authenticated:
            if self.request.user.is_superuser or self.request.user.is_staff:
                return Education.objects.all()
            return Education.objects.filter(user=self.request.user)
        return Education.objects.none()
    
    def perform_create(self, serializer):
        if not self.request.user.is_authenticated:
            raise PermissionDenied("Authentication required")
        # Always set user from request - never trust frontend
        logger = logging.getLogger(__name__)
        logger.info(f"Creating {self.__class__.__name__.replace('ViewSet', '')} for user: {self.request.user.username} (ID: {self.request.user.id})")
        serializer.save(user=self.request.user)
    
    def perform_update(self, serializer):
        instance = self.get_object()
        if not (self.request.user.is_superuser or self.request.user.is_staff):
            if instance.user != self.request.user:
                raise PermissionDenied("You can only update your own records")
        # Never allow user field to be changed via update - always keep original user
        serializer.save(user=instance.user)
    
    def perform_destroy(self, instance):
        if not (self.request.user.is_superuser or self.request.user.is_staff):
            if instance.user != self.request.user:
                raise PermissionDenied("You can only delete your own records")
        instance.delete()


class SkillViewSet(viewsets.ModelViewSet):
    serializer_class = SkillSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        # Users can ONLY see their own data
        if self.request.user.is_authenticated:
            if self.request.user.is_superuser or self.request.user.is_staff:
                return Skill.objects.all()
            return Skill.objects.filter(user=self.request.user)
        return Skill.objects.none()
    
    def perform_create(self, serializer):
        if not self.request.user.is_authenticated:
            raise PermissionDenied("Authentication required")
        # Always set user from request - never trust frontend
        logger = logging.getLogger(__name__)
        logger.info(f"Creating {self.__class__.__name__.replace('ViewSet', '')} for user: {self.request.user.username} (ID: {self.request.user.id})")
        serializer.save(user=self.request.user)
    
    def perform_update(self, serializer):
        instance = self.get_object()
        if not (self.request.user.is_superuser or self.request.user.is_staff):
            if instance.user != self.request.user:
                raise PermissionDenied("You can only update your own records")
        # Never allow user field to be changed via update - always keep original user
        serializer.save(user=instance.user)
    
    def perform_destroy(self, instance):
        if not (self.request.user.is_superuser or self.request.user.is_staff):
            if instance.user != self.request.user:
                raise PermissionDenied("You can only delete your own records")
        instance.delete()
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context


class SocialMediaViewSet(viewsets.ModelViewSet):
    serializer_class = SocialMediaSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        # Users can ONLY see their own data
        if self.request.user.is_authenticated:
            if self.request.user.is_superuser or self.request.user.is_staff:
                return SocialMedia.objects.all()
            return SocialMedia.objects.filter(user=self.request.user)
        return SocialMedia.objects.none()
    
    def perform_create(self, serializer):
        if not self.request.user.is_authenticated:
            raise PermissionDenied("Authentication required")
        # Always set user from request - never trust frontend
        logger = logging.getLogger(__name__)
        logger.info(f"Creating {self.__class__.__name__.replace('ViewSet', '')} for user: {self.request.user.username} (ID: {self.request.user.id})")
        serializer.save(user=self.request.user)
    
    def perform_update(self, serializer):
        instance = self.get_object()
        if not (self.request.user.is_superuser or self.request.user.is_staff):
            if instance.user != self.request.user:
                raise PermissionDenied("You can only update your own records")
        # Never allow user field to be changed via update - always keep original user
        serializer.save(user=instance.user)
    
    def perform_destroy(self, instance):
        if not (self.request.user.is_superuser or self.request.user.is_staff):
            if instance.user != self.request.user:
                raise PermissionDenied("You can only delete your own records")
        instance.delete()
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context


class ContactInfoViewSet(viewsets.ModelViewSet):
    queryset = ContactInfo.objects.all()
    serializer_class = ContactInfoSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    def get_queryset(self):
        # Public users can only see active contact info
        if self.request.user.is_authenticated:
            return ContactInfo.objects.all()
        return ContactInfo.objects.filter(is_active=True)


class ContactMessageViewSet(viewsets.ModelViewSet):
    queryset = ContactMessage.objects.all()
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    def get_serializer_class(self):
        # Use different serializer for create (public) vs other actions (user/admin)
        if self.action == 'create':
            return ContactMessageCreateSerializer
        return ContactMessageSerializer
    
    def get_queryset(self):
        # Only authenticated users can list messages
        if self.request.user.is_authenticated:
            # Admins can see all messages, regular users see only their own
            if self.request.user.is_superuser or self.request.user.is_staff:
                return ContactMessage.objects.all()
            return ContactMessage.objects.filter(user=self.request.user)
        return ContactMessage.objects.none()
    
    def perform_create(self, serializer):
        # User will be set from the username in the URL (handled in create_message_for_user view)
        # For direct API calls, we don't set user here
        serializer.save()
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def reply(self, request, pk=None):
        """Reply to a contact message and send email"""
        message = self.get_object()
        
        # Ensure user can only reply to their own messages (unless admin)
        if not (request.user.is_superuser or request.user.is_staff):
            if message.user != request.user:
                raise PermissionDenied("You can only reply to messages sent to your portfolio")
        
        reply_text = request.data.get('reply', '')
        
        if not reply_text:
            return Response(
                {'error': 'Reply text is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Save reply to database
        message.reply = reply_text
        message.status = 'replied'
        from django.utils import timezone
        message.replied_at = timezone.now()
        message.save()
        
        # Send email to the message sender
        from .utils import send_contact_reply_email
        email_sent, email_message = send_contact_reply_email(message, reply_text)
        
        serializer = self.get_serializer(message)
        response_data = serializer.data
        
        # Include email status in response
        if email_sent:
            response_data['email_status'] = 'sent'
            response_data['email_message'] = email_message
        else:
            response_data['email_status'] = 'failed'
            response_data['email_message'] = email_message
            # Don't fail the request if email fails, just log it
            import logging
            logger = logging.getLogger(__name__)
            logger.error(f"Failed to send email reply: {email_message}")
        
        return Response(response_data)
    
    def perform_update(self, serializer):
        instance = self.get_object()
        # Ensure user can only update their own messages (unless admin)
        if not (self.request.user.is_superuser or self.request.user.is_staff):
            if instance.user != self.request.user:
                raise PermissionDenied("You can only update messages sent to your portfolio")
        serializer.save()
    
    def perform_destroy(self, instance):
        # Ensure user can only delete their own messages (unless admin)
        if not (self.request.user.is_superuser or self.request.user.is_staff):
            if instance.user != self.request.user:
                raise PermissionDenied("You can only delete messages sent to your portfolio")
        instance.delete()
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def mark_read(self, request, pk=None):
        """Mark a message as read"""
        message = self.get_object()
        # Ensure user can only mark their own messages as read (unless admin)
        if not (request.user.is_superuser or request.user.is_staff):
            if message.user != request.user:
                raise PermissionDenied("You can only mark messages sent to your portfolio as read")
        message.status = 'read'
        message.save()
        
        serializer = self.get_serializer(message)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def archive(self, request, pk=None):
        """Archive a message"""
        message = self.get_object()
        # Ensure user can only archive their own messages (unless admin)
        if not (request.user.is_superuser or request.user.is_staff):
            if message.user != request.user:
                raise PermissionDenied("You can only archive messages sent to your portfolio")
        message.status = 'archived'
        message.save()
        
        serializer = self.get_serializer(message)
        return Response(serializer.data)
