from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.validators import FileExtensionValidator
from django.utils import timezone
import pytz


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