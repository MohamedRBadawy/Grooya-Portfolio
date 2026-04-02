from django.urls import path

from apps.accounts.views import LoginView, LogoutView, ProfileView, RegisterView, SessionStatusView

urlpatterns = [
    path('session/', SessionStatusView.as_view(), name='session-status'),
    path('login/', LoginView.as_view(), name='login'),
    path('register/', RegisterView.as_view(), name='register'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('profile/', ProfileView.as_view(), name='profile'),
]
