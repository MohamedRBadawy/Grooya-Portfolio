from django.urls import path

from apps.ai.views import (
    AboutSuggestionView,
    DesignSuggestionView,
    ExperienceSuggestionView,
    HeroSuggestionView,
    PortfolioReviewView,
    ProjectSuggestionView,
    ResumeForJobDescriptionView,
    ResumeFromPortfolioView,
    ResumeTailoringView,
    SectionSuggestionView,
)

urlpatterns = [
    path('suggestions/hero', HeroSuggestionView.as_view(), name='ai-suggest-hero'),
    path('suggestions/about', AboutSuggestionView.as_view(), name='ai-suggest-about'),
    path('suggestions/project', ProjectSuggestionView.as_view(), name='ai-suggest-project'),
    path('suggestions/experience', ExperienceSuggestionView.as_view(), name='ai-suggest-experience'),
    path('suggestions/sections', SectionSuggestionView.as_view(), name='ai-suggest-sections'),
    path('suggestions/design', DesignSuggestionView.as_view(), name='ai-suggest-design'),
    path('review/portfolio', PortfolioReviewView.as_view(), name='ai-review-portfolio'),
    path('resumes/from-portfolio', ResumeFromPortfolioView.as_view(), name='ai-resume-from-portfolio'),
    path('resumes/for-job', ResumeForJobDescriptionView.as_view(), name='ai-resume-for-job'),
    path('resumes/tailor', ResumeTailoringView.as_view(), name='ai-resume-tailor'),
]
