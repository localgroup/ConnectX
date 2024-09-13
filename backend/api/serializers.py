from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Profile, User


class ProfileSerializer(serializers.ModelSerializer):
    # Adding the fields from the User model to the serializer
    first_name = serializers.CharField(source='user.first_name', required=False)
    last_name = serializers.CharField(source='user.last_name', required=False)
    username = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = Profile
        fields = [
            'first_name', 'last_name', 'username', 'bio', 'location', 'website', 'birth_date', 'cover_image', 'avatar'
        ]
        read_only_fields = ['username']
        extra_kwargs = {
            'cover_image': {},
            'avatar': {},
        }

    def update(self, instance, validated_data):
        # Update User model fields
        user = instance.user
        user.first_name = validated_data.get('user', {}).get('first_name', user.first_name)
        user.last_name = validated_data.get('user', {}).get('last_name', user.last_name)
        user.save()

        # Update Profile model fields
        instance.username = validated_data.get('username', instance.username)
        instance.bio = validated_data.get('bio', instance.bio)
        instance.location = validated_data.get('location', instance.location)
        instance.website = validated_data.get('website', instance.website)
        instance.birth_date = validated_data.get('birth_date', instance.birth_date)

        # Update first_name and last_name in Profile model
        instance.first_name = validated_data.get('first_name', instance.user.first_name)
        instance.last_name = validated_data.get('last_name', instance.user.last_name)

        # Handle file fields if they exist
        if 'cover_image' in validated_data:
            instance.cover_image = validated_data.get('cover_image')
        if 'avatar' in validated_data:
            instance.avatar = validated_data.get('avatar')

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
