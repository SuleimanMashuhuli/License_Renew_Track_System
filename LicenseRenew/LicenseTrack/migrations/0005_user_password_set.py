# Generated by Django 5.2 on 2025-05-19 11:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('LicenseTrack', '0004_alter_subscriptions_owner_email_delete_otp'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='password_set',
            field=models.BooleanField(default=False),
        ),
    ]
