from django.db import models
from django.contrib.auth.models import User
from django.core.validators import FileExtensionValidator
from django.utils.text import slugify
import uuid


class UserProfile(models.Model):
    """Extended user profile with portfolio-specific settings"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    username_slug = models.SlugField(max_length=100, unique=True, blank=True, null=True, help_text='Unique URL slug for portfolio (e.g., /username)')
    portfolio_published = models.BooleanField(default=False, help_text='Whether the portfolio is publicly accessible')
    is_approved = models.BooleanField(default=True, help_text='Admin approval required before user can access dashboard')
    email_verified = models.BooleanField(default=False, help_text='Email verification status')
    email_verification_token = models.CharField(max_length=100, blank=True, null=True, help_text='OTP code for email verification')
    email_verification_otp_expires = models.DateTimeField(blank=True, null=True, help_text='OTP expiration time')
    banner_image = models.ImageField(upload_to='banners/', blank=True, null=True, help_text='Portfolio banner/header image')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "User Profile"
        verbose_name_plural = "User Profiles"

    def __str__(self):
        return f"{self.user.username} Profile"
    
    def save(self, *args, **kwargs):
        if not self.username_slug:
            # Generate slug from username
            base_slug = slugify(self.user.username)
            self.username_slug = base_slug
            # Ensure uniqueness
            counter = 1
            while UserProfile.objects.filter(username_slug=self.username_slug).exclude(pk=self.pk).exists():
                self.username_slug = f"{base_slug}-{counter}"
                counter += 1
        super().save(*args, **kwargs)


class AboutMe(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='about_me', null=True, blank=True, help_text='Leave blank for admin/system portfolio')
    name = models.CharField(max_length=200)
    title = models.CharField(max_length=200)
    bio = models.TextField()
    profile_image = models.ImageField(upload_to='profile/', blank=True, null=True)
    logo_image = models.FileField(
        upload_to='logo/', 
        blank=True, 
        null=True, 
        help_text='Upload a custom logo image (PNG, JPG, SVG, etc.). If not provided, a text logo will be used.',
        validators=[FileExtensionValidator(allowed_extensions=['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'svgz'])]
    )
    cv_file = models.FileField(upload_to='cv/', blank=True, null=True, help_text='Upload your CV/Resume (PDF recommended)')
    years_of_experience = models.IntegerField(default=0, help_text='Years of professional experience')
    clients = models.IntegerField(default=0, blank=True, null=True, help_text='Number of clients (leave blank to show N/A)')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "About Me"
        verbose_name_plural = "About Me"

    def __str__(self):
        return f"{self.name} ({self.user.username if self.user else 'System'})"


class Project(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='projects', null=True, blank=True, help_text='Leave blank for admin/system portfolio')
    title = models.CharField(max_length=200)
    description = models.TextField()
    project_image = models.ImageField(upload_to='projects/', blank=True, null=True)
    github_link = models.URLField(blank=True, null=True)
    live_demo_link = models.URLField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title


class Experience(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='experiences', null=True, blank=True, help_text='Leave blank for admin/system portfolio')
    role = models.CharField(max_length=200)
    company = models.CharField(max_length=200)
    start_date = models.DateField()
    end_date = models.DateField(blank=True, null=True)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-start_date']

    def __str__(self):
        return f"{self.role} at {self.company}"


class Education(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='educations', null=True, blank=True, help_text='Leave blank for admin/system portfolio')
    institution = models.CharField(max_length=200)
    degree = models.CharField(max_length=200)
    start_year = models.IntegerField()
    end_year = models.IntegerField(blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-start_year']

    def __str__(self):
        return f"{self.degree} from {self.institution}"


class Skill(models.Model):
    LEVEL_CHOICES = [
        ('Beginner', 'Beginner'),
        ('Intermediate', 'Intermediate'),
        ('Advanced', 'Advanced'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='skills', null=True, blank=True, help_text='Leave blank for admin/system portfolio')
    name = models.CharField(max_length=100)
    level = models.CharField(max_length=20, choices=LEVEL_CHOICES)
    icon_image = models.ImageField(upload_to='skills/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return f"{self.name} ({self.level})"


class SocialMedia(models.Model):
    PLATFORM_CHOICES = [
        ('facebook', 'Facebook'),
        ('instagram', 'Instagram'),
        ('twitter', 'Twitter/X'),
        ('linkedin', 'LinkedIn'),
        ('github', 'GitHub'),
        ('youtube', 'YouTube'),
        ('tiktok', 'TikTok'),
        ('whatsapp', 'WhatsApp'),
        ('telegram', 'Telegram'),
        ('discord', 'Discord'),
        ('reddit', 'Reddit'),
        ('pinterest', 'Pinterest'),
        ('snapchat', 'Snapchat'),
        ('behance', 'Behance'),
        ('dribbble', 'Dribbble'),
        ('medium', 'Medium'),
        ('devto', 'Dev.to'),
        ('codepen', 'CodePen'),
        ('stackoverflow', 'Stack Overflow'),
        ('other', 'Other'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='social_media', null=True, blank=True, help_text='Leave blank for admin/system portfolio')
    platform = models.CharField(max_length=50, choices=PLATFORM_CHOICES, default='other')
    platform_name = models.CharField(max_length=100, blank=True)  # Keep for backward compatibility
    url = models.URLField()
    icon_image = models.ImageField(upload_to='social/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['platform']

    def __str__(self):
        return self.get_platform_display() or self.platform_name


class ContactInfo(models.Model):
    """Contact information displayed on the contact page"""
    email = models.EmailField(help_text='Contact email address')
    phone = models.CharField(max_length=20, blank=True, null=True, help_text='Contact phone number')
    location = models.CharField(max_length=200, blank=True, null=True, help_text='Location/Address')
    is_active = models.BooleanField(default=True, help_text='Show this contact info on the website')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Contact Information"
        verbose_name_plural = "Contact Information"
        ordering = ['-is_active', '-created_at']

    def __str__(self):
        return f"Contact Info - {self.email}"


class ContactMessage(models.Model):
    """Messages submitted through the contact form"""
    STATUS_CHOICES = [
        ('new', 'New'),
        ('read', 'Read'),
        ('replied', 'Replied'),
        ('archived', 'Archived'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='contact_messages', null=True, blank=True, help_text='Portfolio owner who received this message')
    name = models.CharField(max_length=200)
    email = models.EmailField()
    message = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='new')
    reply = models.TextField(blank=True, null=True, help_text='Portfolio owner reply to this message')
    replied_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Contact Message"
        verbose_name_plural = "Contact Messages"
        ordering = ['-created_at']

    def __str__(self):
        return f"Message from {self.name} ({self.email})"
