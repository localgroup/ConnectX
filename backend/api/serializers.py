from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Profile, User, Post, Comment, Likes, Follow, Notification, NotificationType, Message, Mention
from django.conf import settings
from django.db.models import Q
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
            'id', 'first_name', 'last_name', 'username', 'email', 'bio', 'location', 'website', 'birth_date', 'cover_image', 'avatar', 'date_joined', 'timezone'
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
    profile = ProfileSerializer(read_only=True)
    first_name = serializers.CharField(write_only=True)
    last_name = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["id", "email", "username", "password", "first_name", "last_name", "profile"]
        extra_kwargs = {"password": {"write_only": True}}

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value

    def create(self, validated_data):
        password = validated_data.pop('password')
        first_name = validated_data.pop('first_name', '')
        last_name = validated_data.pop('last_name', '')
        
        user = User(**validated_data)
        user.set_password(password)
        user.first_name = first_name
        user.last_name = last_name
        user.save()
        
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
            return None

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
                'id': follow.user.id,
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
                'id': follow.target.id,
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
        
        
class SearchQuerySerializer(serializers.Serializer):
    query = serializers.CharField(max_length=255)
    results = serializers.SerializerMethodField()

    def get_results(self, obj):
        posts = obj.get_relevant_posts()
        profiles = obj.get_relevant_profiles()

        return {
            'posts': PostSerializer(posts, many=True, context=self.context).data,
            'profiles': ProfileSerializer(profiles, many=True, context=self.context).data
        }
        
        
class MessageSerializer(serializers.ModelSerializer):
    sender = serializers.StringRelatedField(read_only=True)
    receiver = serializers.StringRelatedField(read_only=True)
    sender_avatar = serializers.SerializerMethodField()
    receiver_avatar = serializers.SerializerMethodField()
    message_media = serializers.ImageField(max_length=255, use_url=True, required=False)

    class Meta:
        model = Message
        fields = [
            'id', 
            'sender', 
            'sender_avatar',
            'receiver', 
            'receiver_avatar',
            'message_body', 
            'message_media', 
            'sent_at', 
            'is_read'
        ]
        read_only_fields = ['sender', 'sent_at']

    def get_sender_avatar(self, obj):
        request = self.context.get('request')
        if obj.sender.profile.avatar:
            return request.build_absolute_uri(obj.sender.profile.avatar.url)
        return None

    def get_receiver_avatar(self, obj):
        request = self.context.get('request')
        if obj.receiver.profile.avatar:
            return request.build_absolute_uri(obj.receiver.profile.avatar.url)
        return None

    def get_message_media(self, obj):
        if obj.message_media:
            request = self.context.get('request')
            return request.build_absolute_uri(obj.message_media.url)
        return None

    def create(self, validated_data):
        return Message.objects.create(**validated_data)

    def validate(self, data):
        # Validate message_body is not empty
        if not data.get('message_body', '').strip():
            raise serializers.ValidationError({"message_body": "This field is required and cannot be empty."})
        return data
    
    
class NotificationSerializer(serializers.ModelSerializer):
    sender = UserSerializer(read_only=True)
    recipient = UserSerializer(read_only=True)
    
    # Additional context fields
    post_details = serializers.SerializerMethodField()
    comment_details = serializers.SerializerMethodField()
    sender_avatar = serializers.SerializerMethodField()
    mention_details = serializers.SerializerMethodField()
    
    class Meta:
        model = Notification
        fields = [
            'id', 
            'sender', 
            'sender_avatar',
            'recipient', 
            'notification_type', 
            'message', 
            'is_read', 
            'created_at',
            'post_details',
            'comment_details',
            'mention_details'
        ]
    
    def get_sender_avatar(self, obj):
        """
        Get sender's avatar URL
        """
        request = self.context.get('request')
        if obj.sender.profile.avatar:
            return request.build_absolute_uri(obj.sender.profile.avatar.url)
        return None
    
    def get_post_details(self, obj):
        """
        Get additional details about the related post
        """
        if obj.post:
            return {
                'id': obj.post.id,
                'body': obj.post.body,
                'author': obj.post.author.username,
                'media': obj.post.media.url if obj.post.media else None,
                'created_at': obj.post.created_at
            }
        return None
    
    def get_comment_details(self, obj):
        """
        Get additional details about the related comment
        """
        if obj.comment:
            return {
                'id': obj.comment.id,
                'content': obj.comment.content,
                'author': obj.comment.author.username,
                'created_at': obj.comment.created_at
            }
        return None
    
    def get_mention_details(self, obj):
        """
        Get details about the mention if the notification is a mention
        """
        if obj.notification_type == NotificationType.MENTION:
            try:
                mention = Mention.objects.get(
                    Q(post=obj.post) | Q(comment=obj.comment), 
                    user=obj.sender, 
                    mentioned_user=obj.recipient
                )
                return MentionSerializer(mention, context=self.context).data
            except Mention.DoesNotExist:
                return None
        return None


class MentionSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(source='user.username', read_only=True)
    mentioned_user = serializers.StringRelatedField(source='mentioned_user.username', read_only=True)
    user_avatar = serializers.SerializerMethodField()
    mentioned_user_avatar = serializers.SerializerMethodField()
    
    class Meta:
        model = Mention
        fields = [
            'id', 
            'user', 
            'user_avatar', 
            'mentioned_user', 
            'mentioned_user_avatar',
            'post', 
            'comment', 
            'created_at'
        ]
    
    def get_user_avatar(self, obj):
        request = self.context.get('request')
        if obj.user.profile.avatar:
            return request.build_absolute_uri(obj.user.profile.avatar.url)
        return None
    
    def get_mentioned_user_avatar(self, obj):
        request = self.context.get('request')
        if obj.mentioned_user.profile.avatar:
            return request.build_absolute_uri(obj.mentioned_user.profile.avatar.url)
        return None