from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Profile, User


class ProfileSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(source='user.first_name', read_only=True)
    last_name = serializers.CharField(source='user.last_name', read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Profile
        fields = [
            'first_name', 'last_name', 'username', 'bio', 
            'location', 'website', 'birth_date', 'cover_image', 'avatar'
        ]
        read_only_fields = ['username']

    def update(self, instance, validated_data):
        # Handle updates for fields that belong to the profile
        profile_fields = ['bio', 'location', 'website', 'birth_date', 'cover_image', 'avatar']
        for field in profile_fields:
            setattr(instance, field, validated_data.get(field, getattr(instance, field)))
        instance.save()
        return instance


class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(source='profile', read_only=True)
    
    class Meta:
        model = User
        fields = ["id", "email", "username", "password", "profile"]
        extra_kwargs = {"password": {"write_only": True}}

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        
        # Create or update the profile for the user
        profile, created = Profile.objects.get_or_create(user=user)
        if created:
            profile.email = user.email
            profile.save()
        
        return user
