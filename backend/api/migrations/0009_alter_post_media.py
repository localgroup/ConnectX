# Generated by Django 5.1.1 on 2024-09-19 14:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0008_rename_user_comment_author_rename_user_likes_author_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='post',
            name='media',
            field=models.ImageField(blank=True, null=True, upload_to='posts/'),
        ),
    ]
