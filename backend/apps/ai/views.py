from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.ai.serializers import (
    AboutSuggestionSerializer,
    DesignSuggestionSerializer,
    ExperienceSuggestionSerializer,
    HeroSuggestionSerializer,
    PortfolioReviewSerializer,
    ProjectSuggestionSerializer,
    ResumeForJobSerializer,
    ResumeFromPortfolioSerializer,
    SectionSuggestionSerializer,
)
from apps.ai.services import AIServiceError, get_ai_snapshot, run_ai_feature


class BaseAIView(APIView):
    """Shared behavior for anonymous-safe AI endpoints backed by server-owned quotas."""

    permission_classes = [AllowAny]
    serializer_class = None
    feature_key = ''

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            payload = run_ai_feature(request, self.feature_key, serializer.validated_data)
        except AIServiceError as exc:
            return Response(
                {'detail': str(exc), 'code': exc.code, 'ai': get_ai_snapshot(request)},
                status=429 if exc.code == 'quota_exceeded' else 503,
            )

        return Response({'data': payload, 'ai': get_ai_snapshot(request)})


class HeroSuggestionView(BaseAIView):
    serializer_class = HeroSuggestionSerializer
    feature_key = 'heroContent'


class AboutSuggestionView(BaseAIView):
    serializer_class = AboutSuggestionSerializer
    feature_key = 'aboutContent'


class ProjectSuggestionView(BaseAIView):
    serializer_class = ProjectSuggestionSerializer
    feature_key = 'projectStory'


class ExperienceSuggestionView(BaseAIView):
    serializer_class = ExperienceSuggestionSerializer
    feature_key = 'experienceEnhancement'


class DesignSuggestionView(BaseAIView):
    serializer_class = DesignSuggestionSerializer
    feature_key = 'designSuggestions'


class SectionSuggestionView(BaseAIView):
    serializer_class = SectionSuggestionSerializer
    feature_key = 'blockSuggestions'


class PortfolioReviewView(BaseAIView):
    serializer_class = PortfolioReviewSerializer
    feature_key = 'portfolioReview'


class ResumeFromPortfolioView(BaseAIView):
    serializer_class = ResumeFromPortfolioSerializer
    feature_key = 'resumeFromPortfolio'


class ResumeForJobDescriptionView(BaseAIView):
    serializer_class = ResumeForJobSerializer
    feature_key = 'resumeFromJobDescription'


class ResumeTailoringView(BaseAIView):
    serializer_class = ResumeForJobSerializer
    feature_key = 'resumeTailoring'
