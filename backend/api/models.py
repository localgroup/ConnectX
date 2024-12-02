from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.validators import FileExtensionValidator
from django.utils import timezone
import pytz
from django.db.models import Q
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    first_name = models.CharField(max_length=100, blank=True)
    last_name = models.CharField(max_length=100, blank=True)
    username = models.CharField(max_length=100, unique=True, blank=True)
    bio = models.TextField(blank=True, null=True)
    location = models.CharField(max_length=100, blank=True, null=True)
    website = models.URLField(blank=True, null=True)
    birth_date = models.DateField(blank=True, null=True)
    cover_image = models.ImageField(upload_to='cover_images/', blank=True, null=True)
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)
    email = models.EmailField(max_length=200, blank=True)
    timezone = models.CharField(max_length=100, default='UTC')

    def __str__(self):
        return f"{self.user.username} ({self.email})"

    # Save and sync the User and Profile model.
    def save(self, *args, **kwargs):
        self.username = self.user.username
        self.first_name = self.user.first_name
        self.last_name = self.user.last_name
        self.email = self.user.email
        super().save(*args, **kwargs)

    @property
    def date_joined(self):
        return self.user.date_joined
    

# Create or update the User when one is created.
@receiver(post_save, sender=User)
def create_or_update_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)
    else:
        instance.profile.save()


class Post(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='posts')
    body = models.TextField(max_length=240)
    media = models.ImageField(upload_to='posts/', null=True, blank=True, validators=[
        FileExtensionValidator(allowed_extensions=['jpg', 'jpeg', 'png', 'gif', 'bmp'], message='Only image files are allowed')
    ])
    created_at = models.DateTimeField(default=timezone.now)

    def number_of_likes(self):
        return self.likes.count()

    def number_of_comments(self):
        return self.comments.count()

    # Get the user timezone
    def get_created_at_in_user_timezone(self, author):
        user_timezone = pytz.timezone(author.profile.timezone)
        return self.created_at.astimezone(user_timezone)


class Comment(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='comments')
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='comments')
    content = models.TextField(max_length=240)
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.author.username} commented on post {self.post.id}"

    def get_created_at_in_user_timezone(self, user):
        user_timezone = pytz.timezone(user.profile.timezone)
        return self.created_at.astimezone(user_timezone)


class Likes(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='likes')
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='likes')
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        unique_together = ('post', 'author')

    def __str__(self):
        return f"{self.author.username} liked post {self.post.id}"
    
    
class Follow(models.Model):
    user = models.ForeignKey(User, related_name='following', on_delete=models.CASCADE)
    target = models.ForeignKey(User, related_name='followers', on_delete=models.CASCADE)
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        unique_together = ('user', 'target')

    def __str__(self):
        return f"{self.user.username} follows {self.target.username}"
    
    
class SearchQuery:
    def __init__(self, query):
        self.query = query

    def get_relevant_posts(self):
        return Post.objects.filter(body__icontains=self.query)

    def get_relevant_profiles(self):
        return Profile.objects.filter(
            Q(user__username__icontains=self.query) | 
            Q(bio__icontains=self.query)
        )
        
        
class Message(models.Model):
    sender = models.ForeignKey(User, related_name='sent_messages', on_delete=models.CASCADE)
    receiver = models.ForeignKey(User, related_name='received_messages', on_delete=models.CASCADE)
    message_body = models.TextField(max_length=500)
    message_media = models.ImageField(upload_to='messages/', null=True, blank=True, validators=[
        FileExtensionValidator(allowed_extensions=['jpg', 'jpeg', 'png', 'gif', 'bmp'], message='Only image files are allowed')
    ])
    sent_at = models.DateTimeField(default=timezone.now)
    is_read = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.sender.username} messaged {self.receiver.username}"


class NotificationType(models.TextChoices):
    LIKE = 'LIKE', 'Like'
    COMMENT = 'COMMENT', 'Comment'
    FOLLOW = 'FOLLOW', 'Follow'
    MESSAGE = 'MESSAGE', 'Message'
    MENTION = 'MENTION', 'Mention'
    

class Notification(models.Model):
    recipient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_notifications')
    notification_type = models.CharField(max_length=20, choices=NotificationType.choices)
    
    # Generic foreign key for different notification sources
    content_type = models.ForeignKey('contenttypes.ContentType', on_delete=models.CASCADE, null=True, blank=True)
    object_id = models.PositiveIntegerField(null=True, blank=True)
    content_object = GenericForeignKey('content_type', 'object_id')
    
    # Additional context fields
    post = models.ForeignKey(Post, on_delete=models.CASCADE, null=True, blank=True)  
    comment = models.ForeignKey('Comment', on_delete=models.CASCADE, null=True, blank=True)
    
    # Notification details
    message = models.TextField(max_length=255)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=timezone.now)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['recipient', 'is_read']),
            models.Index(fields=['notification_type']),
        ]
    
    def __str__(self):
        return f"{self.sender.first_name} - {self.notification_type} to {self.recipient.username}"
    
    @classmethod
    def create_like_notification(cls, like):
        """
        Create a notification for a like
        """  
        return cls.objects.create(
            recipient=like.post.author,
            sender=like.author,
            notification_type=NotificationType.LIKE,
            post=like.post,
            content_object=like,
            message=f"{like.author.profile.first_name or like.author.username} liked your post"
        )
        
    @classmethod
    def create_mention_notification(cls, mention):
        """
        Create a notification for a mention
        """
        return cls.objects.create(
            recipient=mention.mentioned_user,
            sender=mention.user,
            notification_type=NotificationType.MENTION,
            post=mention.post,
            comment=mention.comment,
            content_object=mention,
            message=f"{mention.user.profile.first_name or mention.user.username} mentioned you"
        )
    
    @classmethod
    def create_comment_notification(cls, comment):
        """
        Create a notification for a comment
        """
        return cls.objects.create(
            recipient=comment.post.author,
            sender=comment.author,
            notification_type=NotificationType.COMMENT,
            post=comment.post,
            content_object=comment,
            message=f"{comment.author.profile.first_name or comment.author.username} commented on your post"
        )
    
    @classmethod
    def create_follow_notification(cls, follow):
        """
        Create a notification for a follow
        """
        return cls.objects.create(
            recipient=follow.target,
            sender=follow.user,
            notification_type=NotificationType.FOLLOW,
            content_object=follow,
            message=f"{follow.user.first_name or follow.user.username} started following you"
        )
    
    @classmethod
    def create_message_notification(cls, message):
        """
        Create a notification for a message
        """
        return cls.objects.create(
            recipient=message.receiver,
            sender=message.sender,
            notification_type=NotificationType.MESSAGE,
            content_object=message,
            message=f"New message from {message.sender.first_name}"
        )
        
    def mark_as_read(self):
        """
        Mark the notification as read
        """
        self.is_read = True
        self.save()
    
    @classmethod
    def get_unread_count(cls, user):
        """
        Get the count of unread notifications for a user
        """
        return cls.objects.filter(recipient=user, is_read=False).count()
    

class Mention(models.Model):
    """
    Model to track mentions in posts and comments
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='mentions')
    post = models.ForeignKey('Post', on_delete=models.CASCADE, null=True, blank=True, related_name='mentions')
    comment = models.ForeignKey('Comment', on_delete=models.CASCADE, null=True, blank=True, related_name='mentions')
    mentioned_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='mentioned_in')
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.user.username} mentioned {self.mentioned_user.username}"
    
    class Meta:
        unique_together = ['user', 'mentioned_user', 'post', 'comment']


@receiver(post_save, sender=Likes)
def create_like_notification(sender, instance, created, **kwargs):
    if created:
        Notification.create_like_notification(instance)


@receiver(post_save, sender=Comment)
def create_comment_notification(sender, instance, created, **kwargs):
    if created:
        Notification.create_comment_notification(instance)


@receiver(post_save, sender=Follow)
def create_follow_notification(sender, instance, created, **kwargs):
    if created:
        Notification.create_follow_notification(instance)


@receiver(post_save, sender=Message)
def create_message_notification(sender, instance, created, **kwargs):
    if created and not instance.is_read:
        Notification.create_message_notification(instance)
        
        


        

