from django.urls import path
from . import views


urlpatterns = [
    path('', views.WelcomeView.as_view(), name='welcome'),
    path('home/', views.HomeView.as_view(), name='home'),
]
