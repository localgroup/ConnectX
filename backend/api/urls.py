from django.urls import path
from . import views


urlpatterns = [
    path('', views.WelcomeView.as_view(), name='welcome'),
    path('home/', views.HomeView.as_view(), name='home'),
    path('<str:username>/update-profile/', views.UpdateProfileView.as_view(), name='update-profile'),
    path('<str:username>/', views.ProfileView.as_view(), name="profile"),
]