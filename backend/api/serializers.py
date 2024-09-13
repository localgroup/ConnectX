from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Profile, User


class ProfileSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(source='user.first_name', required=False)
    last_name = serializers.CharField(source='user.last_name', required=False)
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)
    
    class Meta:
        model = Profile
        fields = [
            'first_name', 'last_name', 'username', 'email', 'bio', 'location', 'website', 'birth_date', 'cover_image', 'avatar'
        ]
        read_only_fields = ['username', 'email']

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', {})
        user = instance.user

        for attr, value in user_data.items():
            setattr(user, attr, value)
            setattr(instance, attr, value)  # Update Profile model as well
        user.save()

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
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
