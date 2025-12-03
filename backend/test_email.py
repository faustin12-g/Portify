"""
Quick email test script.
Run this to test if your Gmail configuration is working.

Usage:
    python test_email.py your-test-email@gmail.com
"""

import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.core.mail import send_mail
from django.conf import settings

def test_email():
    # Get recipient email from command line or use default
    recipient = sys.argv[1] if len(sys.argv) > 1 else input("Enter test email address: ")
    
    print("\n" + "="*50)
    print("Testing Email Configuration")
    print("="*50)
    print(f"From: {settings.EMAIL_HOST_USER}")
    print(f"To: {recipient}")
    print(f"Host: {settings.EMAIL_HOST}")
    print(f"Port: {settings.EMAIL_PORT}")
    print("="*50 + "\n")
    
    if not settings.EMAIL_HOST_USER:
        print("ERROR: EMAIL_HOST_USER is not set in settings.py")
        return False
    
    if not settings.EMAIL_HOST_PASSWORD:
        print("ERROR: EMAIL_HOST_PASSWORD is not set in settings.py")
        print("\nTip: You need to set up a Gmail App Password first.")
        print("   See GMAIL_SETUP_GUIDE.md for instructions.\n")
        return False
    
    try:
        print("Sending test email...")
        send_mail(
            subject='Test Email from Portfolio System',
            message='This is a test email to verify your Gmail configuration is working correctly!',
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[recipient],
            fail_silently=False,
        )
        print("SUCCESS! Email sent successfully!")
        print(f"   Check the inbox of: {recipient}")
        print("   (Also check spam folder if not in inbox)")
        return True
    except Exception as e:
        print(f"ERROR: Failed to send email")
        print(f"   Error: {str(e)}")
        print("\nCommon issues:")
        print("   1. Make sure you're using a Gmail App Password (not regular password)")
        print("   2. Make sure 2-Step Verification is enabled on your Google account")
        print("   3. Check that EMAIL_HOST_USER and EMAIL_HOST_PASSWORD are set correctly")
        print("   4. See GMAIL_SETUP_GUIDE.md for detailed instructions")
        return False

if __name__ == '__main__':
    test_email()

