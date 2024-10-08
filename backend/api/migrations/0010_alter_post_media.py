# Generated by Django 5.1.1 on 2024-09-19 14:52

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0009_alter_post_media'),
    ]

    operations = [
        migrations.AlterField(
            model_name='post',
            name='media',
            field=models.ImageField(blank=True, null=True, upload_to='posts/', validators=[django.core.validators.FileExtensionValidator(allowed_extensions=['jpg', 'jpeg', 'png', 'gif', 'bmp'], message='Only image files are allowed')]),
        ),
    ]
