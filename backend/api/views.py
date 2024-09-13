# views.py
from django.shortcuts import get_object_or_404, render
from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth.models import User
from .serializers import UserSerializer, ProfileSerializer
from .models import Profile


class ProfileView(generics.RetrieveAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]
    lookup_url_kwarg = 'username'

    def get_object(self):
        username = self.kwargs.get(self.lookup_url_kwarg)
        user = get_object_or_404(User, username=username)
        return user.profile


class UpdateProfileView(generics.UpdateAPIView):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'user__username'
    lookup_url_kwarg = 'username'

    def get_object(self):
        username = self.kwargs.get(self.lookup_url_kwarg)
        user = get_object_or_404(User, username=username)
        if self.request.user != user:
            raise permissions.PermissionDenied("You do not have permission to update this profile.")
        return user.profile

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)


class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


class WelcomeView(generics.GenericAPIView):
    permission_classes = [AllowAny]
    
    def get(self, request):
        return Response(status=status.HTTP_200_OK, data={"message": "Welcome to the home page"})


class HomeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        serializer = UserSerializer(user)
        return Response({
            'message': 'Welcome to ConnectX!',
            'user': serializer.data
        })
