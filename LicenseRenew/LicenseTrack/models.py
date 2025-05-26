from django.db import models
from datetime import datetime
from datetime import date, timedelta
from dateutil.relativedelta import relativedelta
from django.contrib.auth.hashers import make_password
from django.contrib.auth.hashers import check_password
from django.contrib.auth.models import AbstractUser
from django.conf import settings
from django.core.files.base import ContentFile
from PIL import Image, ImageDraw, ImageFont
from io import BytesIO
import io
from django.contrib.auth.signals import user_logged_in
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from django.db.models.signals import post_save, pre_save
from enum import Enum 
from django.contrib.auth.hashers import make_password, check_password
from django.utils import timezone
from django.utils.timezone import now


#------------VERSION2--------------#
class UserRole(models.TextChoices):
    SUPERUSER = 'superuser', 'Superuser'
    ADMIN = 'admin', 'Admin'

class User(AbstractUser):
    mobiNumber = models.CharField(max_length=15)
    userRole = models.CharField(max_length=10, choices=UserRole.choices, default=UserRole.ADMIN)
    password_set = models.BooleanField(default=False)

    def __str__(self):
        return self.first_name
    
    def set_password(self, raw_password):
        super().set_password(raw_password)
        self.password_set = True
    
        if self.pk:
            self.save(update_fields=["password", "password_set"])


    def check_password(self, raw_password):
      
        return super().check_password(raw_password)


    def generate_avatar(self):

        first_name_initial = self.first_name[0].upper() if self.first_name else ''
        last_name_initial = self.last_name[0].upper() if self.last_name else ''
        initials = f"{first_name_initial}{last_name_initial}"

        size = (100, 100)
        img = Image.new('RGB', size, color=(0, 123, 255))
        draw = ImageDraw.Draw(img)

        font_paths = [
            "path/to/your/font.ttf",
            "path/to/your/font.otf",
            "path/to/your/backup_font.ttf",
            "path/to/your/backup_font.otf",
        ]

        for font_path in font_paths:
            if os.path.exists(font_path):
                try:
                    font = ImageFont.truetype(font_path, 50)
                    break
                except Exception as e:  
                    font = None
        
        if not font:
            font = ImageFont.load_default()
        
        width, height = draw.textsize(initials, font=font)
        position = ((size[0] - width) / 2, (size[1] - height) / 2)

    
        draw.text(position, initials, fill="white", font=font)


        image_io = BytesIO()
        img.save(image_io, 'PNG')
        image_io.seek(0)

        return image_io



class Owner(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    department = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.email})"



class SubscriptionQuerySet(models.QuerySet):
    def active(self):
        today = timezone.now().date()
        return self.filter(start_date__lte=today, end_date__gte=today)

    def expired(self):
        today = timezone.now().date()
        return self.filter(end_date__lt=today)

    def pending(self):
        today = timezone.now().date()
        return self.filter(start_date__gt=today)


class Subscriptions(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True )
    sub_name = models.CharField(max_length=100)
    sub_type = models.CharField(max_length=100)
    issuing_authority = models.CharField(max_length=100)
    issuing_date = models.DateField()
    expiring_date = models.DateField()
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    reference = models.CharField(max_length=15)
    associated_documents = models.FileField(upload_to='Subscription/')
    is_document_uploaded = models.BooleanField(default=False)
    owners = models.ManyToManyField(Owner, related_name='subscriptions') 


    objects = SubscriptionQuerySet.as_manager()


    @property
    def status(self):
        today = timezone.now().date()
        if self.expiring_date < today:
            return 'expired'
        elif self.issuing_date > today:
            return 'pending'
        else:
            return 'active'


    def save(self, *args, **kwargs):
        if isinstance(self.issuing_date, str):
            self.issuing_date = datetime.strptime(self.issuing_date, "%Y-%m-%d").date()
        if isinstance(self.expiring_date, str):
            self.expiring_date = datetime.strptime(self.expiring_date, "%Y-%m-%d").date()

        self.is_document_uploaded = bool(self.associated_documents)

        super(Subscriptions, self).save(*args, **kwargs)

    def __str__(self):
        return f"Subscription {self.sub_type} - Status: {self.status}"


class Notification(models.Model):
    recipient = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    message = models.TextField()
    read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Notification for {self.recipient.email} - {self.created_at}"

    def mark_as_read(self):
        self.read = True
        self.save()

    @classmethod
    def get_all_notifications(cls):
        return cls.objects.all()
    
    @classmethod

    def get_unread_notifications(cls):
        return cls.objects.filter(read=False)



class Renewing(models.Model):
    subscriptions = models.ForeignKey(Subscriptions, on_delete=models.CASCADE)
    renewed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    renewal_date = models.DateField()
    new_expiry_date = models.DateField()
    paid_amount = models.DecimalField(max_digits=10, decimal_places=2)
    receipt = models.FileField()
    notes = models.TextField(blank=True, null=True)

    def save(self, *args, **kwargs):
        
        if self.renewal_date:
            self.subscriptions.issuing_date = self.renewal_date
        
        if self.new_expiry_date:
            self.subscriptions.expiring_date = self.new_expiry_date

        if self.paid_amount is not None:
            self.subscriptions.amount = self.paid_amount

        if self.receipt is not None:
            self.subscriptions.associated_documents = self.receipt

        self.subscriptions.save()

        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.subscription} - Renewed on {self.renewal_date}"
    