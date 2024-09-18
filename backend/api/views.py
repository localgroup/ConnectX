# views.py
from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAuthenticatedOrReadOnly
from django.contrib.auth.models import User
from .serializers import UserSerializer, ProfileSerializer, PostSerializer, CommentSerializer, LikesSerializer
from .models import Profile, Post, Comment, Likes
from rest_framework.exceptions import ValidationError, PermissionDenied


class LikesListCreateView(generics.ListCreateAPIView):
    queryset = Likes.objects.all()
    serializer_class = LikesSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        post_pk = self.kwargs.get('post_pk')
        return Likes.objects.filter(post__pk=post_pk)

    def perform_create(self, serializer):
        post_pk = self.kwargs.get('post_pk')
        post = get_object_or_404(Post, pk=post_pk)
        # Ensure a user can only like a post once.
        if not Likes.objects.filter(post=post, author=self.request.user).exists():
            serializer.save(post=post, author=self.request.user)
        else:
            raise ValidationError("You have already liked this post.")


class LikesDetailView(generics.RetrieveDestroyAPIView):
    queryset = Likes.objects.all()
    serializer_class = LikesSerializer
    permission_classes = [IsAuthenticated]

    def perform_destroy(self, instance):
        # Ensure that only the user who liked the post can remove the like.
        if instance.author == self.request.user:
            instance.delete()
        else:
            raise PermissionDenied("You cannot remove someone else's like.")


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

    def perform_update(self, serializer):
        # Ensure that only the author of the comment can update it.
        if self.request.user == self.get_object().author:
            serializer.save(author=self.request.user)
        else:
            raise PermissionDenied("You do not have permission to edit this comment.")

    def perform_destroy(self, instance):
        # Ensure that only the author of the comment can delete it.
        if instance.author == self.request.user:
            instance.delete()
        else:
            raise PermissionDenied("You do not have permission to delete this comment.")


class PostListCreateView(generics.ListCreateAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]  # Allow anyone to view posts, but only authenticated users can create.

    def get_queryset(self):
        user = self.request.user
        return Post.objects.filter(author=user)
    
    def perform_create(self, serializer):
        serializer.save(author=self.request.user)  # Associate the post with the currently logged-in user.



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
    
    def perform_update(self, serializer):
        # Ensure that only the author can update the post.
        if self.request.user == self.get_object().author:
            serializer.save(author=self.request.user)
        else:
            raise PermissionDenied("You do not have permission to edit this post.")
        
    def perform_destroy(self, instance):
        if instance.author == self.request.user:
            instance.delete()
        else:
            raise PermissionDenied("You do not have permission to delete this post.")


# Retrieve user profile.
class ProfileView(generics.RetrieveAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]
    lookup_url_kwarg = 'username'

    def get_object(self):
        username = self.kwargs.get(self.lookup_url_kwarg)
        user = get_object_or_404(User, username=username)
        return user.profile


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
            raise permissions.PermissionDenied("You do not have permission to update this profile.")
        return user.profile

    # Update the User and Profiel model.
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)  # Check if the data recieved is partially updated.
        instance = self.get_object()    # Retrieve the model instance to update.
        serializer = self.get_serializer(instance, data=request.data, partial=partial)   # Serializer instance to update.
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)   # Update the model.
        return Response(serializer.data)


# Create a new user.
class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


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
