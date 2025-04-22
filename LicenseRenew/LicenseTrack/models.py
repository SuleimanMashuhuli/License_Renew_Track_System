from django.db import models
from datetime import datetime
from datetime import date, timedelta
from django.utils.timezone import now
from dateutil.relativedelta import relativedelta
from django.contrib.auth.hashers import make_password
from django.contrib.auth.hashers import check_password
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
from django.conf import settings
from django.core.files.base import ContentFile
from PIL import Image, ImageDraw, ImageFont
from io import BytesIO
import io


class Users(AbstractUser):
    username = models.CharField(max_length=255, unique=True)
    password = models.CharField(max_length=255)
    middle_name = models.CharField(max_length=100, null=False, blank=False)
    phone_number = models.CharField(max_length=15, null=True, blank=True)
    email = models.EmailField(unique=True)
    last_login = models.DateTimeField(null=True, blank=True, default=timezone.now)

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email', 'first_name', 'middle_name', 'last_name', 'phone_number']

    def set_password(self, raw_password):
       
        self.password = make_password(raw_password)

    def check_password(self, raw_password):
        
       
        return check_password(raw_password, self.password)

    
    def full_name(self):
        return f"{self.first_name} {self.middle_name or ''} {self.last_name}".strip()

class User_Profile(models.Model):
    user = models.OneToOneField(Users, on_delete=models.CASCADE, related_name='profile')
    bio = models.TextField(blank=True, null=True)
    address_line1 = models.CharField(max_length=255, blank=True, null=True)
    address_line2 = models.CharField(max_length=255, blank=True, null=True)
    postcode = models.CharField(max_length=20, blank=True, null=True)
    state = models.CharField(max_length=100, blank=True, null=True)
    country = models.CharField(max_length=100, blank=True, null=True)
    region = models.CharField(max_length=100, blank=True, null=True)

    def full_name(self):
        return f"{self.first_name} {self.last_name}".strip()
    
def generate_initials_avatar(self) -> io.BytesIO:
    name = f"{self.user.first_name} {self.user.last_name}".strip()
    initials = ''.join([word[0].upper() for word in name.split() if word])

    image_size = (150, 150)
    image = Image.new("RGB", image_size, color=(255, 255, 255))
    draw = ImageDraw.Draw(image)

    # List of font files to try
    font_paths = [
        "path/to/your/font.ttf",
        "path/to/your/font.otf",
        "path/to/your/backup_font.ttf",
        "path/to/your/backup_font.otf",
    ]

    font = None
    for font_path in font_paths:
        if os.path.exists(font_path):
            try:
                font = ImageFont.truetype(font_path, 50)
                break
            except Exception as e:
                print(f"Failed to load font from {font_path}: {e}")
    
    if not font:
        font = ImageFont.load_default()

    
    bbox = draw.textbbox((0, 0), initials, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    position = ((image_size[0] - text_width) / 2, (image_size[1] - text_height) / 2)

    draw.text(position, initials, fill=(0, 0, 0), font=font)

    buffer = io.BytesIO()
    image.save(buffer, format='PNG')
    buffer.seek(0)
    return buffer


    def save(self, *args, **kwargs):
        user_data = kwargs.pop('user_data', None)

      
        if user_data:
            user = self.user
            updated = False

            if 'first_name' in user_data and user.first_name != user_data['first_name']:
                user.first_name = user_data['first_name']
                updated = True
            if 'last_name' in user_data and user.last_name != user_data['last_name']:
                user.last_name = user_data['last_name']
                updated = True
            if 'email' in user_data and user.email != user_data['email']:
                user.email = user_data['email']
                updated = True
            if 'phone_number' in user_data and user.phone_number != user_data['phone_number']:
                user.phone_number = user_data['phone_number']
                updated = True

            if updated:
                user.save()

       
        self.generate_initials_avatar()

        super().save(*args, **kwargs)

    

    
class Providers(models.Model):
    service_provider = models.CharField(max_length=255)
    address = models.CharField(max_length=255)
    description = models.TextField(max_length=510)

    def __str__(self):
        return self.service_provider
    

STATUS_CHOICES = [
        ('active', 'Active'),
        ('expired', 'Expired'),
        ('decommissioned', 'Decommissioned')
]
class Subscription(models.Model):
    DURATION_TYPE_MAP = {
        0: "Trial",
        1: "Monthly",
        3: "Quarterly",
        6: "Semi-Annual",
        12: "Annual",
        24: "Biennial",
        36: "Triennial",
        48: "Quadrennial",
    }
    subscription_type = models.CharField(max_length=255, blank=True)
    amount_paid = models.DecimalField(max_digits=10, decimal_places=2)
    duration = models.IntegerField()
    issue_date = models.DateField()
    expiry_date = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    document = models.FileField(upload_to="subscription/",  null=True, blank=True)
    providers = models.ForeignKey(Providers, on_delete=models.CASCADE, related_name='subscription')
    users = models.ForeignKey(Users, on_delete=models.CASCADE, related_name='subscription')
    

    def __str__(self):
        return f"{self.subscription_type} - {self.providers.service_provider}"

    def update_status(self):
        today = date.today()
        if self.status == 'decommissioned':
            return

        # Ensure both expiry_date and today are datetime.date objects
        if isinstance(self.expiry_date, str):
            self.expiry_date = datetime.strptime(self.expiry_date, "%Y-%m-%d").date()

        if isinstance(self.issue_date, str):
            self.issue_date = datetime.strptime(self.issue_date, "%Y-%m-%d").date()

        if self.expiry_date < today:
            self.status = 'expired'
        else:
            self.status = 'active'

    def save(self, *args, **kwargs):
        if isinstance(self.expiry_date, str):
            self.expiry_date = datetime.strptime(self.expiry_date, "%Y-%m-%d").date()

        if isinstance(self.issue_date, str):
            self.issue_date = datetime.strptime(self.issue_date, "%Y-%m-%d").date()

        self.subscription_type = self.DURATION_TYPE_MAP.get(self.duration, f"{self.duration} Months")

        if self.id:
            old = Subscription.objects.get(id=self.id)
            if old.providers != self.providers:
                self.status = 'decommissioned'
            elif self.expiry_date < timezone.now().date():
                self.status = 'expired'
            else:
                self.status = 'active'
        else:
            if self.expiry_date < timezone.now().date():
                self.status = 'expired'
            else:
                self.status = 'active'

        super().save(*args, **kwargs)

   
class Renewals(models.Model):
    subscription = models.ForeignKey(Subscription, on_delete=models.CASCADE, related_name='renewals')
    renewal_date = models.DateField()
    new_expiry_date = models.DateField()
    old_expiry_date = models.DateField(blank=True, null=True)
    paid_amount = models.DecimalField(max_digits=10, decimal_places=2)
    receipt = models.FileField(upload_to='receipt/')
    renewed_by = models.ForeignKey(Users, on_delete=models.SET_NULL, null=True, blank=True)
    notes = models.TextField(blank=True, null=True)

    def save(self, *args, **kwargs):
        
        if not self.old_expiry_date and self.subscription:
            self.old_expiry_date = self.subscription.expiry_date
        
        if self.renewal_date:
            self.subscription.issue_date = self.renewal_date
        
        if self.new_expiry_date:
            self.subscription.expiry_date = self.new_expiry_date

        if self.paid_amount is not None:
            self.subscription.amount_paid = self.paid_amount

        self.subscription.save()

        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.subscription} - Renewed on {self.renewal_date}"
    


class OTP(models.Model):
    user = models.ForeignKey('Users', on_delete=models.CASCADE)
    code = models.CharField(max_length=6)
    created_at = models.DateTimeField(default=timezone.now)
    is_used = models.BooleanField(default=False)