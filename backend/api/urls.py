from django.urls import path
from . import views


# urlpatterns = [
#     path('', views.WelcomeView.as_view(), name='welcome'),
#     path('home/', views.HomeView.as_view(), name='home'),
#     path('<str:username>/update-profile/', views.UpdateProfileView.as_view(), name='update-profile'),
#     path('<str:username>/', views.ProfileView.as_view(), name="profile"),
#     path('posts/', views.PostListCreateView.as_view(), name='post-list'),
#     path('posts/<int:pk>/', views.PostDetailView.as_view(), name='post-detail'), 
#     path('likes/', views.LikesListCreateView.as_view(), name='like-list'),
#     path('likes/<int:pk>/', views.LikesDetailView.as_view(), name='like-detail'),
#     path('comments/', views.CommentListCreateView.as_view(), name='comment-list'),
#     path('comments/<int:pk>/', views.CommentDetailView.as_view(), name='comment-detail'),
# ]


urlpatterns = [
    path('', views.WelcomeView.as_view(), name='welcome'),
    path('home/', views.HomeView.as_view(), name='home'),
    path('<str:username>/update-profile/', views.UpdateProfileView.as_view(), name='update-profile'),
    path('<str:username>/', views.ProfileView.as_view(), name="profile"),
    path('posts/', views.PostListCreateView.as_view(), name='post-list'),
    path('posts/<int:pk>/', views.PostDetailView.as_view(), name='post-detail'), 
    path('posts/<int:post_pk>/likes/', views.LikesListCreateView.as_view(), name='like-list'),
    path('likes/<int:pk>/', views.LikesDetailView.as_view(), name='like-detail'),
    path('posts/<int:post_pk>/comments/', views.CommentListCreateView.as_view(), name='comment-list'),
    path('comments/<int:pk>/', views.CommentDetailView.as_view(), name='comment-detail'),
]