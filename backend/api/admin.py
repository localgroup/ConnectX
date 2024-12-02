from django.contrib import admin
from django.utils.translation import gettext_lazy as _
from .models import Profile, Notification, Message, Post, Likes, Follow, Comment, Mention
from dateutil.parser import parse


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = (
        'username',
        'first_name',
        'last_name',
        'email',
        'location',
        'date_joined',
    )
    list_filter = ('location',)
    search_fields = ('username', 'first_name', 'last_name', 'email', 'bio')
    readonly_fields = ('username', 'email', 'date_joined')
    fieldsets = (
        (None, {
            'fields': ('user', 'username', 'email', 'date_joined')
        }),
        ('Personal Info', {
            'fields': ('first_name', 'last_name', 'bio', 'birth_date')
        }),
        ('Contact Info', {
            'fields': ('location', 'website')
        }),
        ('Profile Images', {
            'fields': ('avatar', 'cover_image')
        }),
    )

    def date_joined(self, obj):
        return obj.user.date_joined
    date_joined.short_description = _('Joined')
    date_joined.admin_order_field = 'user__date_joined'  # Allows sorting by date_joined

    def get_queryset(self, request):
        return super().get_queryset(request).select_related('user')

    def get_search_results(self, request, queryset, search_term):
        queryset, use_distinct = super().get_search_results(request, queryset, search_term)
        try:
            search_term_as_date = parse(search_term)
        except ValueError:
            pass
        else:
            queryset |= self.model.objects.filter(user__date_joined__date=search_term_as_date.date())
        return queryset, use_distinct
    
    
admin.site.register(Post)

admin.site.register(Likes)

admin.site.register(Comment)

admin.site.register(Follow)

admin.site.register(Message)

admin.site.register(Notification)

admin.site.register(Mention)