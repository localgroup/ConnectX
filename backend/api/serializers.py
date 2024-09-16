from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Profile, User, Post, Comment, Likes


class ProfileSerializer(serializers.ModelSerializer):
    # Retrieves the related user info from the User model.
    first_name = serializers.CharField(source='user.first_name', required=False)
    last_name = serializers.CharField(source='user.last_name', required=False)
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)
    date_joined = serializers.DateTimeField(read_only=True)
    
    # Define the metadata for the serializer.
    class Meta:
        model = Profile   # Use the Profile model.
        fields = [
            'first_name', 'last_name', 'username', 'email', 'bio', 'location', 'website', 'birth_date', 'cover_image', 'avatar', 'date_joined', 'timezone'
        ]
        read_only_fields = ['username', 'email', 'date_joined']

    # Update the model with the recieved data.
    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', {})    # Extract the user data from validated_data.
        user = instance.user          # Retrieve the related User instance from the Profile instance.

        for attr, value in user_data.items():
            setattr(user, attr, value)     # Update the User model.
            setattr(instance, attr, value)  # Update Profile model.
        user.save()   # Save the User instance.

        for attr, value in validated_data.items():
            setattr(instance, attr, value)   # Update the Profile model with the updated data.
        instance.save()   # Save the updated Profile.

        return instance



class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(source='profile', read_only=True)   # Retrieve the Profile instance.
    
    class Meta:
        model = User   # Use User model.
        fields = ["id", "email", "username", "password", "profile"]
        extra_kwargs = {"password": {"write_only": True}}

    # Validate email.
    def validate_email(self, value):   
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value

    # Create the user with the validated data recieved.
    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        
        # Create or update the profile for the user.
        profile, created = Profile.objects.get_or_create(user=user)
        if created:
            profile.email = user.email
            profile.save()
        
        return user
    
    
class PostSerializer(serializers.ModelSerializer):
    # Retrieve the related user info.
    user = serializers.StringRelatedField(source='user.username', read_only=True)
    created_at = serializers.DateTimeField(read_only=True)
    updated_at = serializers.DateTimeField(read_only=True)

    # Including counts of likes and comments.
    number_of_likes = serializers.SerializerMethodField()
    number_of_comments = serializers.SerializerMethodField()

    def get_number_of_likes(self, obj):
        return obj.likes.count()

    def get_number_of_comments(self, obj):
        return obj.comments.count()

    class Meta:
        model = Post
        fields = [
            'id', 'user', 'body', 'media', 'created_at', 'updated_at',
            'number_of_likes', 'number_of_comments'
        ]
        read_only_fields = ['user', 'created_at', 'updated_at', 'number_of_likes', 'number_of_comments']


class LikesSerializer(serializers.ModelSerializer):
    # Retrieve the full post details using PostSerializer.
    post = PostSerializer(read_only=True)
    user = serializers.StringRelatedField(source='user.username', read_only=True)

    class Meta:
        model = Likes
        fields = ['id', 'post', 'user']
        read_only_fields = ['post', 'user']


class CommentSerializer(serializers.ModelSerializer):
    # Retrieve the full post details using PostSerializer.
    post = PostSerializer(read_only=True)
    user = serializers.StringRelatedField(source='user.username', read_only=True)
    created_at = serializers.DateTimeField(read_only=True)
    updated_at = serializers.DateTimeField(read_only=True)

    class Meta:
        model = Comment
        fields = ['id', 'post', 'user', 'content', 'created_at', 'updated_at']
        read_only_fields = ['post', 'user', 'created_at', 'updated_at']

