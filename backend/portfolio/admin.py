from django.contrib import admin
from .models import (
    UserProfile, AboutMe, Project, Experience, Education, 
    Skill, SocialMedia, ContactInfo, ContactMessage
)


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'username_slug', 'is_approved', 'email_verified', 'portfolio_published', 'created_at')
    list_filter = ('is_approved', 'email_verified', 'portfolio_published', 'created_at')
    search_fields = ('user__username', 'user__email', 'username_slug')
    readonly_fields = ('created_at', 'updated_at', 'email_verification_token')
    fieldsets = (
        ('User Information', {
            'fields': ('user', 'username_slug')
        }),
        ('Status', {
            'fields': ('is_approved', 'email_verified', 'portfolio_published')
        }),
        ('Media', {
            'fields': ('banner_image',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at')
        }),
    )
    
    def save_model(self, request, obj, form, change):
        """Override to mark if portfolio was unpublished by admin"""
        if change:
            # Get the old instance to check if portfolio_published changed
            old_obj = UserProfile.objects.get(pk=obj.pk)
            # If portfolio was unpublished (True -> False), mark it as admin action
            if old_obj.portfolio_published and not obj.portfolio_published:
                obj._unpublished_by_admin = True
        super().save_model(request, obj, form, change)


@admin.register(AboutMe)
class AboutMeAdmin(admin.ModelAdmin):
    list_display = ('name', 'user', 'title', 'created_at')
    list_filter = ('created_at', 'user')
    search_fields = ('name', 'title', 'bio', 'user__username')


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'created_at')
    list_filter = ('created_at', 'user')
    search_fields = ('title', 'description', 'user__username')


@admin.register(Experience)
class ExperienceAdmin(admin.ModelAdmin):
    list_display = ('role', 'company', 'user', 'start_date', 'end_date')
    list_filter = ('start_date', 'user')
    search_fields = ('role', 'company', 'description', 'user__username')


@admin.register(Education)
class EducationAdmin(admin.ModelAdmin):
    list_display = ('degree', 'institution', 'user', 'start_year', 'end_year')
    list_filter = ('start_year', 'user')
    search_fields = ('degree', 'institution', 'description', 'user__username')


@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = ('name', 'level', 'user', 'created_at')
    list_filter = ('level', 'created_at', 'user')
    search_fields = ('name', 'user__username')


@admin.register(SocialMedia)
class SocialMediaAdmin(admin.ModelAdmin):
    list_display = ('platform', 'url', 'user', 'created_at')
    list_filter = ('platform', 'created_at', 'user')
    search_fields = ('platform', 'url', 'user__username')


@admin.register(ContactInfo)
class ContactInfoAdmin(admin.ModelAdmin):
    list_display = ('email', 'phone', 'location', 'is_active', 'created_at')
    list_filter = ('is_active', 'created_at')
    search_fields = ('email', 'phone', 'location')


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'user', 'status', 'created_at', 'replied_at')
    list_filter = ('status', 'created_at', 'replied_at', 'user')
    search_fields = ('name', 'email', 'message', 'user__username', 'user__email')
    readonly_fields = ('created_at', 'updated_at', 'replied_at')
