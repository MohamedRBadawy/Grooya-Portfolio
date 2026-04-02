from django.db.models import Count
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.analytics.models import PortfolioViewEvent
from apps.leads.models import Lead
from apps.portfolios.models import Portfolio


class PortfolioAnalyticsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, portfolio_id: int):
        portfolio = get_object_or_404(Portfolio, id=portfolio_id, owner=request.user)
        view_events = PortfolioViewEvent.objects.filter(portfolio=portfolio)
        leads = Lead.objects.filter(portfolio=portfolio)
        top_referrers = list(
            view_events.exclude(referrer='')
            .values('referrer')
            .annotate(count=Count('id'))
            .order_by('-count')[:5]
        )

        return Response(
            {
                'portfolio_id': portfolio.id,
                'views': view_events.count(),
                'unique_visitors': view_events.exclude(visitor_id='').values('visitor_id').distinct().count(),
                'leads': leads.count(),
                'top_referrers': top_referrers,
            }
        )
