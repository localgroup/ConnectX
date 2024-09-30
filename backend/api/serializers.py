from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Profile, User, Post, Comment, Likes, Follow
from django.conf import settings
from urllib.parse import urljoin


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
    # profile = ProfileSerializer(source='profile', read_only=True)   # Retrieve the Profile instance.
    profile = ProfileSerializer(read_only=True)   # Retrieve the Profile instance.
    
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
    author = serializers.StringRelatedField(source='author.username', read_only=True)
    author_avatar = serializers.SerializerMethodField()  # Method to get avatar URL
    created_at = serializers.DateTimeField(read_only=True)
    updated_at = serializers.DateTimeField(read_only=True)

    # Including counts of likes and comments.
    number_of_likes = serializers.SerializerMethodField()
    number_of_comments = serializers.SerializerMethodField()
    media = serializers.ImageField(max_length=255, use_url=True, required=False)

    # Method to retrieve the full avatar URL
    def get_author_avatar(self, obj):
        request = self.context.get('request')
        if obj.author.profile.avatar:
            avatar_url = obj.author.profile.avatar.url
            return request.build_absolute_uri(avatar_url)
        else:
            return None  # or a default avatar URL

    def get_number_of_likes(self, obj):
        return obj.likes.count()

    def get_number_of_comments(self, obj):
        return obj.comments.count()

    def get_media(self, obj):
        if obj.media:
            request = self.context.get('request')
            media_url = obj.media.url
            return request.build_absolute_uri(media_url)
        else:
            return None

    class Meta:
        model = Post
        fields = [
            'id', 'author', 'author_avatar', 'body', 'media', 'created_at', 'updated_at',
            'number_of_likes', 'number_of_comments'
        ]
        read_only_fields = ['author', 'created_at', 'updated_at', 'number_of_likes', 'number_of_comments']

    # Get the posts made by the profile author.
    def get_user_posts(self, obj):
        user_posts = Post.objects.filter(author=obj.author)
        return self.__class__(user_posts, many=True, context={'request': self.context['request']}).data
    
    # Create a post made by the user.
    def create(self, validated_data):
        request = self.context.get('request')
        user = request.user
        validated_data['author'] = user
        return super().create(validated_data)



class LikesSerializer(serializers.ModelSerializer):
    # Retrieve the full post details using PostSerializer.
    post = PostSerializer(read_only=True)
    author = serializers.StringRelatedField(source='author.username', read_only=True)

    class Meta:
        model = Likes
        fields = ['id', 'post', 'author']
        read_only_fields = ['post', 'author']


class CommentSerializer(serializers.ModelSerializer):
    # Retrieve the full post details using PostSerializer.
    post = PostSerializer(read_only=True)
    author = serializers.StringRelatedField(source='author.username', read_only=True)
    created_at = serializers.DateTimeField(read_only=True)
    updated_at = serializers.DateTimeField(read_only=True)

    class Meta:
        model = Comment
        fields = ['id', 'post', 'author', 'content', 'created_at', 'updated_at']
        read_only_fields = ['post', 'author', 'created_at', 'updated_at']


class FollowSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(source='user.username')
    target = serializers.StringRelatedField(source='target.username')
    followers = serializers.SerializerMethodField()
    following = serializers.SerializerMethodField()
    followers_count = serializers.SerializerMethodField()
    following_count = serializers.SerializerMethodField()
    is_following = serializers.SerializerMethodField()

    class Meta:
        model = Follow
        fields = ['id', 'user', 'target', 'created_at', 'followers', 'following', 'followers_count', 'following_count', 'is_following']

    def get_followers(self, obj):
        followers = Follow.objects.filter(target=obj.target)
        request = self.context.get('request')
        return [
            {
                'username': follow.user.username, 
                'bio': follow.user.profile.bio,
                'is_following': Follow.objects.filter(user=request.user, target=follow.user).exists() if request and request.user.is_authenticated else False
            } 
            for follow in followers
        ]

    def get_following(self, obj):
        following = Follow.objects.filter(user=obj.target)
        request = self.context.get('request')
        return [
            {
                'username': follow.target.username, 
                'bio': follow.target.profile.bio,
                'is_following': Follow.objects.filter(user=request.user, target=follow.target).exists() if request and request.user.is_authenticated else False
            } 
            for follow in following
        ]

    def get_followers_count(self, obj):
        return Follow.objects.filter(target=obj.target).count()

    def get_following_count(self, obj):
        return Follow.objects.filter(user=obj.target).count()

    def get_is_following(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return Follow.objects.filter(user=request.user, target=obj.target).exists()
        return False

    def to_representation(self, instance):
        data = super().to_representation(instance)
        if instance is None:
            data = {
                'followers': [],
                'following': [],
                'followers_count': 0,
                'following_count': 0,
                'is_following': False
            }
        return data
        
