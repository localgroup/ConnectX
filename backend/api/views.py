from django.shortcuts import render
from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth.models import User
from .serializers import UserSerializer



class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


class HomeView(generics.GenericAPIView):
    permission_classes = [AllowAny]
    
    def get(self, request):
        return Response(status=status.HTTP_200_OK, data={"message": "Welcome to the home page"})


