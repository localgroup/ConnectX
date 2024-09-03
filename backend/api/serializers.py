from django.contrib.auth.models import User
from rest_framework import serializers
# from .models import 


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "email", "first_name", "last_name", "username", "password", ]
        extra_kwargs = {"password": {"write_only": True}}
        
        
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user