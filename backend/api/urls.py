from django.urls import path
from . import views


urlpatterns = [
    path('', views.WelcomeView.as_view(), name='welcome'),
    path('home/', views.HomeView.as_view(), name='home'),
    path('<str:username>/', views.ProfileView.as_view(), name="profile"),
    path('<str:username>/update-profile/', views.UpdateProfileView.as_view(), name='update-profile'),
    # path('posts/', views.PostListCreateView.as_view(), name='post-list'),
    path('<str:username>/posts/', views.PostListCreateView.as_view(), name='user-post-list'),
    path('<str:username>/follower/', views.FollowView.as_view(), name='followers'),
    path('<str:username>/following/', views.FollowView.as_view(), name='following'),
    path('posts/<int:pk>/', views.PostDetailView.as_view(), name='post-detail'), 
    path('posts/<int:post_pk>/likes/', views.LikesView.as_view(), name='like'),
    path('posts/<int:post_pk>/comments/', views.CommentListCreateView.as_view(), name='comment-list'),
    path('comments/<int:pk>/', views.CommentDetailView.as_view(), name='comment-detail'),
    path('follow/<str:username>/', views.FollowView.as_view(), name='follow-user'),
]