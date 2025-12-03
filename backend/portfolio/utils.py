from django.core.mail import send_mail
from django.conf import settings
from django.template.loader import render_to_string
from django.utils.html import strip_tags


def send_contact_reply_email(message, reply_text):
    """
    Send an email reply to a contact message sender.
    
    Args:
        message: ContactMessage instance
        reply_text: The reply message text
    
    Returns:
        tuple: (success: bool, message: str)
    """
    try:
        # Get email settings
        from_email = settings.DEFAULT_FROM_EMAIL or settings.EMAIL_HOST_USER
        
        if not from_email:
            return False, "Email not configured. Please set EMAIL_HOST_USER and DEFAULT_FROM_EMAIL in settings."
        
        if not settings.EMAIL_HOST_PASSWORD:
            return False, "Email password not configured. Please set EMAIL_HOST_PASSWORD in settings."
        
        # Email subject
        subject = f'Re: Your message - Portfy'
        
        # Try to render HTML template
        try:
            html_message = render_to_string('email/contact_reply.html', {
                'message_name': message.name,
                'original_message': message.message,
                'reply_text': reply_text,
            })
            text_message = strip_tags(html_message)
        except:
            # Fallback to plain text if template doesn't exist
            text_message = f"""
Hello {message.name},

Thank you for contacting us. Here is our reply to your message:

---
Original Message:
{message.message}
---

Our Reply:
{reply_text}

---
Best regards,
Portfy Team
            """.strip()
            html_message = None
        
        # Send email using send_mail for consistency with other emails
        send_mail(
            subject=subject,
            message=text_message,
            from_email=from_email,
            recipient_list=[message.email],
            html_message=html_message if html_message else None,
            fail_silently=False,
        )
        
        return True, "Email sent successfully"
        
    except Exception as e:
        import logging
        logger = logging.getLogger(__name__)
        logger.error(f"Email sending error: {str(e)}")
        return False, f"Failed to send email: {str(e)}"

