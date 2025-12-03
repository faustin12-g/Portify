from django.db.models.signals import pre_save, post_save
from django.dispatch import receiver
from django.db import transaction
from .models import UserProfile
import logging

logger = logging.getLogger(__name__)


@receiver(pre_save, sender=UserProfile)
def capture_portfolio_status(sender, instance, **kwargs):
    """Capture the old portfolio_published status before save"""
    try:
        if instance.pk:
            try:
                old_instance = UserProfile.objects.get(pk=instance.pk)
                instance._old_portfolio_published = old_instance.portfolio_published
            except UserProfile.DoesNotExist:
                instance._old_portfolio_published = None
        else:
            instance._old_portfolio_published = None
    except Exception as e:
        # Don't let signal errors break the save operation
        logger.error(f"Error in capture_portfolio_status signal: {str(e)}", exc_info=True)
        instance._old_portfolio_published = None


@receiver(post_save, sender=UserProfile)
def send_portfolio_status_email_signal(sender, instance, created, **kwargs):
    """Send email when portfolio_published status changes"""
    try:
        # Only send email if the status actually changed
        old_status = getattr(instance, '_old_portfolio_published', None)
        new_status = instance.portfolio_published
        
        # Skip if status hasn't changed (unless it's a new profile being published)
        if old_status == new_status and not created:
            return
        
        # Skip if it's a new profile that's not published
        if created and not new_status:
            return
        
        # Determine if unpublished by admin (if status changed from True to False)
        unpublished_by_admin = getattr(instance, '_unpublished_by_admin', False)
        
        # Import here to avoid circular imports - use a safer approach
        try:
            from core.views import send_portfolio_status_email
        except (ImportError, AttributeError) as e:
            logger.error(f"Failed to import send_portfolio_status_email: {str(e)}")
            return
        
        # Only proceed if the function exists and is callable
        if not callable(send_portfolio_status_email):
            logger.error("send_portfolio_status_email is not callable")
            return
        
        # Safely get user - check if user exists
        try:
            user = instance.user
            if not user or not hasattr(user, 'id'):
                logger.warning("User instance is invalid in portfolio status signal")
                return
        except Exception as user_error:
            logger.error(f"Error accessing user in signal: {str(user_error)}")
            return
        
        # Send email asynchronously using transaction.on_commit to avoid blocking
        # Wrap in another try-except to ensure it doesn't break anything
        try:
            def safe_send_email():
                try:
                    send_portfolio_status_email(
                        user=user,
                        is_published=new_status,
                        unpublished_by_admin=unpublished_by_admin
                    )
                except Exception as email_error:
                    logger.error(f"Error in send_portfolio_status_email callback: {str(email_error)}", exc_info=True)
            
            transaction.on_commit(safe_send_email)
            logger.info(f"Portfolio status email queued for user: {user.username} (ID: {user.id}), Published: {new_status}, Old Status: {old_status}")
        except Exception as commit_error:
            logger.error(f"Error queuing portfolio status email: {str(commit_error)}", exc_info=True)
            # Don't re-raise - just log and continue
    except Exception as e:
        # Don't let signal errors break the save operation
        logger.error(f"Error in send_portfolio_status_email_signal: {str(e)}", exc_info=True)
        # Silently fail - don't break the save
        import traceback
        logger.error(f"Full traceback: {traceback.format_exc()}")

