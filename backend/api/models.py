from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver


class Profile(models.Model):
    # Define profile fields.
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

    def __str__(self):
        return f"{self.user.username} ({self.email})"

    # Save and sync the info with the User model.
    def save(self, *args, **kwargs):
        self.username = self.user.username
        self.first_name = self.user.first_name
        self.last_name = self.user.last_name
        self.email = self.user.email
        super().save(*args, **kwargs)
        
    @property
    def date_joined(self):  # Get the date_joined from the User model.
        return self.user.date_joined
    
    
# Create or update the user.
@receiver(post_save, sender=User)
def create_or_update_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)
    else:
        instance.profile.save()