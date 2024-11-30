# views.py
from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAuthenticatedOrReadOnly
from django.contrib.auth.models import User
from django.db.models import Q
from .serializers import UserSerializer, ProfileSerializer,MessageSerializer, PostSerializer, CommentSerializer, LikesSerializer, FollowSerializer, NotificationSerializer
from .models import Profile, Post, Comment, Likes, Follow, Notification, Message
from rest_framework.exceptions import ValidationError, PermissionDenied


class MessageListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        messages = Message.objects.filter(receiver=request.user)
        serializer = MessageSerializer(messages, many=True, context={'request': request})
        return Response(serializer.data)


class MessageListCreateView(generics.ListCreateAPIView):
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        other_username = self.kwargs.get('username')
        other_user = get_object_or_404(User, username=other_username)

        return Message.objects.filter(
            (Q(sender=user, receiver=other_user) | Q(sender=other_user, receiver=user))
        ).order_by('-sent_at')

    def perform_create(self, serializer):
        other_username = self.kwargs.get('username')
        receiver = get_object_or_404(User, username=other_username)

        if receiver == self.request.user:
            raise ValidationError({'receiver': 'You cannot send a message to yourself'})

        serializer.save(sender=self.request.user, receiver=receiver)

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class MessageDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Message.objects.filter(
            Q(sender=user) | Q(receiver=user)
        )

    def perform_update(self, serializer):
        if self.get_object().sender != self.request.user:
            raise PermissionDenied("You cannot edit messages you didn't send")
        serializer.save()

    def perform_destroy(self, instance):
        if instance.sender != self.request.user:
            raise PermissionDenied("You cannot delete messages you didn't send")
        instance.delete()
        

class SearchView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request, *args, **kwargs):
        query = request.data.get('query', '').strip()
        
        if not query:
            return Response(
                {'error': 'Search query is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # Search posts
            posts = Post.objects.filter(
                Q(body__icontains=query) |
                Q(author__username__icontains=query)
            )
            
            # Search profiles
            profiles = Profile.objects.filter(
                Q(user__username__icontains=query) |
                Q(first_name__icontains=query) |
                Q(last_name__icontains=query) |
                Q(bio__icontains=query)
            )

            # Serialize the results
            posts_serializer = PostSerializer(posts, many=True, context={'request': request})
            profiles_serializer = ProfileSerializer(profiles, many=True, context={'request': request})

            return Response({
                'query': query,
                'results': {
                    'posts': posts_serializer.data,
                    'profiles': profiles_serializer.data
                }
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class FollowView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = FollowSerializer

    def get(self, request, username=None):
        target_user = get_object_or_404(User, username=username) if username else request.user
        follow = Follow.objects.filter(user=request.user, target=target_user).first()
        
        if follow is None:
            # Create a dummy follow object to get the counts
            follow = Follow(user=request.user, target=target_user)
        
        serializer = self.get_serializer(follow, context={'request': request})
        return Response(serializer.data)

    def post(self, request, username):
        target_user = get_object_or_404(User, username=username)
        
        if request.user == target_user:
            return Response({"error": "You cannot follow yourself."}, status=status.HTTP_400_BAD_REQUEST)
        
        follow, created = Follow.objects.get_or_create(user=request.user, target=target_user)
        
        serializer = self.get_serializer(follow, context={'request': request})
        return Response(serializer.data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)

    def delete(self, request, username):
        target_user = get_object_or_404(User, username=username)
        
        follow = Follow.objects.filter(user=request.user, target=target_user).first()
        
        if follow:
            follow.delete()
            # Create a dummy follow object to get the updated counts
            dummy_follow = Follow(user=request.user, target=target_user)
            serializer = self.get_serializer(dummy_follow, context={'request': request})
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({"error": f"You are not following {username}."}, status=status.HTTP_400_BAD_REQUEST)


class LikesView(generics.GenericAPIView):
    queryset = Likes.objects.all()
    serializer_class = LikesSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request, post_pk):
        post = get_object_or_404(Post, pk=post_pk)
        like = Likes.objects.filter(post=post, author=request.user).first()
        is_liked = like is not None
        likes_count = post.number_of_likes()
        return Response({
            'is_liked': is_liked,
            'likes_count': likes_count
        }, status=status.HTTP_200_OK)

    def post(self, request, post_pk):
        post = get_object_or_404(Post, pk=post_pk)
        if not Likes.objects.filter(post=post, author=request.user).exists():
            serializer = self.get_serializer(data={'post': post_pk})
            serializer.is_valid(raise_exception=True)
            serializer.save(post=post, author=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            raise ValidationError("You have already liked this post.")

    def delete(self, request, post_pk):
        post = get_object_or_404(Post, pk=post_pk)
        like = Likes.objects.filter(post=post, author=request.user)
        if like.exists():
            like.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            raise ValidationError("You have not liked this post.")


class CommentListCreateView(generics.ListCreateAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]  # Allow anyone to view comments, but only authenticated users can create.

    def get_queryset(self):
        post_pk = self.kwargs.get('post_pk')
        return Comment.objects.filter(post__pk=post_pk)
    
    def perform_create(self, serializer):
        post_pk = self.kwargs.get('post_pk')
        post = get_object_or_404(Post, pk=post_pk)
        serializer.save(post=post, author=self.request.user)  # Associate the comment with the currently logged-in user.


class CommentDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    def get_object(self):
        pk = self.kwargs.get('pk')
        comment = get_object_or_404(Comment, pk=pk)
        return comment

    def perform_destroy(self, instance):
        # Ensure that only the author of the comment can delete it.
        if instance.author == self.request.user:
            instance.delete()
        else:
            raise PermissionDenied("You do not have permission to delete this comment.")


class PostListCreateView(generics.ListCreateAPIView):
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]  # Allow anyone to view posts, but only authenticated users can create.
    
    def get_queryset(self):
        if 'username' in self.kwargs:
            username = self.kwargs['username']
            user = get_object_or_404(User, username=username)
            return Post.objects.filter(author=user)
        else:
            return Post.objects.all()


class PostDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]  # Only post authors should be able to update/delete their posts.

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
    
    def get_object(self):
        pk = self.kwargs.get('pk')
        post = get_object_or_404(Post, pk=pk)
        return post
        
    def perform_destroy(self, instance):
        if instance.author == self.request.user:
            instance.delete()
        else:
            raise PermissionDenied("You do not have permission to delete this post.")


# Retrieve user profile.
class ProfileView(generics.RetrieveAPIView):
    # Retrieve a user's profile
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]
    lookup_url_kwarg = 'username'

    def get_object(self):
        # Retrieve a user's profile by username
        username = self.kwargs.get(self.lookup_url_kwarg)
        user = get_object_or_404(User, username=username)
        return user.profile
    
    def get(self, request, *args, **kwargs):
        # Return the user's profile and their posts
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        data = serializer.data
        
        if self.kwargs.get(self.lookup_url_kwarg) == request.user.username:
            user_posts = PostSerializer(Post.objects.filter(author=request.user), many=True, context={'request': request}).data
        else:
            user_posts = PostSerializer(Post.objects.filter(author=instance.user), many=True, context={'request': request}).data

        data['posts'] = user_posts
        return Response(data)


# Update user profile.
class UpdateProfileView(generics.UpdateAPIView):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'user__username'
    lookup_url_kwarg = 'username'

    def get_object(self):
        username = self.kwargs.get(self.lookup_url_kwarg)
        user = get_object_or_404(User, username=username)
        if self.request.user != user:
            raise PermissionDenied("You do not have permission to update this profile.")
        return user.profile

    # Update the User and Profiel model.
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)  # Check if the data recieved is partially updated.
        instance = self.get_object()    # Retrieve the model instance to update.
        serializer = self.get_serializer(instance, data=request.data, partial=partial)   # Serializer instance to update.
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)   # Update the model.
        return Response(serializer.data)


# Register a new User.
class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def perform_create(self, serializer):
        serializer.save()


class WelcomeView(generics.GenericAPIView):
    permission_classes = [AllowAny]
    
    def get(self, request):
        return Response(status=status.HTTP_200_OK, data={"message": "Welcome to the home page"})


class HomeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        serializer = UserSerializer(user)
        return Response({
            'message': 'Welcome to ConnectX!',
            'user': serializer.data
        })


# Notification view
class NotificationListView(generics.ListAPIView):
    """
    List all notifications for the current user
    """
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        Return notifications for the current user, ordered by most recent
        """
        return Notification.objects.filter(
            recipient=self.request.user
        ).order_by('-created_at')

    def list(self, request, *args, **kwargs):
        """
        Custom list method to include additional metadata
        """
        queryset = self.get_queryset()
        
        # Pagination
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(queryset, many=True)
        return Response({
            'notifications': serializer.data,
            'total_count': queryset.count(),
            'unread_count': queryset.filter(is_read=False).count()
        })