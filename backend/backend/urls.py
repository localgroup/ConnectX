from django.contrib import admin
from django.urls import path, include
from api.views import CreateUserView, SearchView, PostListCreateView, MessageListCreateView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/user/register/', CreateUserView.as_view(), name='register'),
    path('api/token/', TokenObtainPairView.as_view(), name='get_token'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='refresh'),
    path('api/posts/', PostListCreateView.as_view(), name='post-list'),
    path('api/search/', SearchView.as_view(), name='search'),
    path('api/messages/', MessageListCreateView.as_view(), name='message-list-create'),
    path('api_auth/', include('rest_framework.urls')),
    path('api/', include('api.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
