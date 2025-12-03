"""
Test script to check portfolio API endpoint
Run: python manage.py shell < test_portfolio_api.py
Or: python manage.py shell
Then copy-paste the code below
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from portfolio.models import UserProfile, AboutMe, Project, Skill, Experience, Education, SocialMedia
from django.contrib.auth import get_user_model

User = get_user_model()

# Check all users and their profiles
print("=" * 60)
print("ALL USERS AND THEIR PROFILES")
print("=" * 60)
for user in User.objects.all():
    print(f"\nUser: {user.username} (ID: {user.id})")
    try:
        profile = user.profile
        print(f"  - Username Slug: {profile.username_slug}")
        print(f"  - Portfolio Published: {profile.portfolio_published}")
        print(f"  - Is Approved: {profile.is_approved}")
        print(f"  - Email Verified: {profile.email_verified}")
        
        # Check portfolio data
        about_count = AboutMe.objects.filter(user=user).count()
        project_count = Project.objects.filter(user=user).count()
        skill_count = Skill.objects.filter(user=user).count()
        exp_count = Experience.objects.filter(user=user).count()
        edu_count = Education.objects.filter(user=user).count()
        social_count = SocialMedia.objects.filter(user=user).count()
        
        print(f"  - About Me entries: {about_count}")
        print(f"  - Projects: {project_count}")
        print(f"  - Skills: {skill_count}")
        print(f"  - Experiences: {exp_count}")
        print(f"  - Educations: {edu_count}")
        print(f"  - Social Media: {social_count}")
        
        if about_count > 0:
            about = AboutMe.objects.filter(user=user).first()
            print(f"    → About Me: {about.name} - {about.title}")
        
    except UserProfile.DoesNotExist:
        print("  - No profile found!")

print("\n" + "=" * 60)
print("TESTING PORTFOLIO ENDPOINT")
print("=" * 60)

# Test with a specific username
test_username = "peace"  # Change this to test with different username
print(f"\nTesting portfolio for username_slug: {test_username}")

try:
    profile = UserProfile.objects.get(username_slug=test_username)
    print(f"✓ Profile found for user: {profile.user.username}")
    print(f"  - Portfolio Published: {profile.portfolio_published}")
    
    if not profile.portfolio_published:
        print("  ⚠️  Portfolio is NOT published!")
        print("  → User needs to publish from dashboard")
    else:
        print("  ✓ Portfolio is published")
        
        user = profile.user
        about_me = AboutMe.objects.filter(user=user).first()
        if about_me:
            print(f"  ✓ About Me found: {about_me.name}")
        else:
            print("  ⚠️  No About Me data found")
            
        projects = Project.objects.filter(user=user)
        print(f"  - Projects: {projects.count()}")
        
        skills = Skill.objects.filter(user=user)
        print(f"  - Skills: {skills.count()}")
        
except UserProfile.DoesNotExist:
    print(f"✗ No profile found with username_slug: {test_username}")
    # Try to find by username
    try:
        user = User.objects.get(username=test_username)
        print(f"  → Found user by username: {user.username}")
        profile, created = UserProfile.objects.get_or_create(user=user)
        print(f"  → Profile created: {created}")
        print(f"  → Username Slug: {profile.username_slug}")
        print(f"  → Portfolio Published: {profile.portfolio_published}")
    except User.DoesNotExist:
        print(f"  ✗ User not found with username: {test_username}")

print("\n" + "=" * 60)
print("DONE")
print("=" * 60)

