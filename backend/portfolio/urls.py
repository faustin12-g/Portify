from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    AboutMeViewSet,
    ProjectViewSet,
    ExperienceViewSet,
    EducationViewSet,
    SkillViewSet,
    SocialMediaViewSet,
    ContactInfoViewSet,
    ContactMessageViewSet
)

router = DefaultRouter()
router.register(r'about', AboutMeViewSet, basename='about')
router.register(r'projects', ProjectViewSet, basename='project')
router.register(r'experience', ExperienceViewSet, basename='experience')
router.register(r'education', EducationViewSet, basename='education')
router.register(r'skills', SkillViewSet, basename='skill')
router.register(r'social-media', SocialMediaViewSet, basename='social-media')
router.register(r'contact-info', ContactInfoViewSet, basename='contact-info')
router.register(r'contact-messages', ContactMessageViewSet, basename='contact-message')

urlpatterns = [
    path('', include(router.urls)),
]

