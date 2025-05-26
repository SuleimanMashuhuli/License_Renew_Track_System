from django.db.models.signals import m2m_changed, post_save, pre_save
from django.contrib.auth.signals import user_logged_in
from django.dispatch import receiver
from datetime import date, timedelta
from .models import Subscriptions, Notification, User



@receiver(user_logged_in)
def first_admin(sender, request, user, **kwargs):

    if User.objects.count() < 1:
        user.is_superuser = True
        user.is_staff = True
        user.userRole = 'superuser'
        user.save()
    elif not user.is_superuser:
        user.is_staff = True
        user.userRole = 'admin'
        user.save()
        


@receiver(post_save, sender=Subscriptions)
def create_Subscriptions_notification(sender, instance, created, **kwargs):
    if created:
        owner_names = ', '.join([f"{o.first_name} {o.last_name}" for o in instance.owners.all()])
        message = f"Welcome {owner_names}, you have been assigned a new Subscriptions."
        Notification.objects.create(recipient=instance.user, message=message)


@receiver(m2m_changed, sender=Subscriptions.owners.through)
def owners_changed(sender, instance, action, **kwargs):
    if action == "post_add":
        owner_names = ', '.join([f"{o.first_name} {o.last_name}" for o in instance.owners.all()])
        message = f"Subscriptions '{instance.sub_type}' owners updated: {owner_names}."
        Notification.objects.create(recipient=instance.user, message=message)


@receiver(post_save, sender=Subscriptions)
def create_Subscriptions_expiry_notification(sender, instance, **kwargs):
    
    if instance.expiring_date and instance.expiring_date <= date.today() + timedelta(days=7):
        owner_names = ', '.join([f"{o.first_name} {o.last_name}" for o in instance.owners.all()])
        message = f"The {instance.sub_type} Subscriptions for {owner_names} is expiring soon on {instance.expiring_date}."
        Notification.objects.create(recipient=instance.user, message=message)