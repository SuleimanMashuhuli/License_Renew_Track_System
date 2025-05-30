
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'LicenseRenew.settings')

import re
from io import BytesIO
import traceback
import sys
from django.core.mail import send_mail
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.authentication import TokenAuthentication
import fitz
import uuid
from django.core.mail import send_mail
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.exceptions import AuthenticationFailed, ValidationError
import pytesseract
from PIL import Image
from django.contrib.auth.hashers import make_password
from django.contrib.auth import get_user_model
from fuzzywuzzy import fuzz
from dateutil import parser
from django.db import transaction
from django.db.models import Count, Sum, Q
from odf.opendocument import load 
from odf.text import P
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from pdf2image import convert_from_path
from django.shortcuts import render
from django.http import HttpResponse, JsonResponse, HttpResponseBadRequest, HttpResponseNotFound, FileResponse
from django.core.files.base import ContentFile
from django.shortcuts import get_object_or_404
from django.core.files.storage import default_storage
from rest_framework.decorators import api_view, permission_classes,APIView, parser_classes, authentication_classes
from rest_framework.response import Response
from rest_framework import status, viewsets
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
import json
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import action
from django.utils.timezone import now
from django.utils import timezone
import io
from django.contrib.auth import authenticate
from datetime import date, timedelta
import pandas as pd
import matplotlib.pyplot as plt
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from rest_framework.permissions import AllowAny
import uuid

#-----v2-----#
from datetime import datetime, timedelta, date 
from .models import Subscriptions, User, Notification, UserRole
from .serializers import SubscriptionsSerializer, UserSerializer, NotificationSerializer
from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from django.core.cache import cache
from rest_framework import status
from rest_framework.status import HTTP_200_OK
from django.conf import settings
import random
import jwt
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed, ValidationError
from rest_framework.decorators import api_view
from rest_framework.status import HTTP_200_OK
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import AllowAny
from weasyprint import HTML
import tempfile
from collections import defaultdict
from django.template import loader
from django.contrib.staticfiles import finders
import codecs
import csv
from django.core.mail import EmailMultiAlternatives
import logging


 
#-------VERSION2-------#
@api_view(['POST'])
def create_admin(request):
    if request.method == 'POST':

        is_first_user = User.objects.count() == 0

        first_name = request.data.get('first_name')
        last_name = request.data.get('last_name')
        email = request.data.get('email')
        mobi_number = request.data.get('mobiNumber')
        password = request.data.get('password')

        user_role = UserRole.SUPERUSER if is_first_user else request.data.get('userRole', UserRole.ADMIN)

       
        user = User(
            first_name=first_name,
            last_name=last_name,
            email=email,
            mobiNumber=mobi_number,
            userRole=user_role,
            password_set=bool(password)
        )

        
        if password:
            user.set_password(password)
        else:
            user.set_unusable_password()

        
        if is_first_user:
            user.is_superuser = True
            user.is_staff = True

        user.save()

        Notification.objects.create(
            recipient=user,
            message=f"User {first_name} {last_name} was created with role {user_role}."
        )

        serializer = UserSerializer(user)
        return Response({
            "message": f"{'Superuser' if is_first_user else 'Admin'} created successfully.",
            "user": serializer.data
        })


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

@api_view(['GET'])
def list_all_users(request):
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_current_user(request):
    print("Authenticated user:", request.user)
    if request.user.is_authenticated:
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
    else:
        return Response({"detail": "Not authenticated"}, status=401)


@api_view(['GET'])
def get_user(request, id):
    try:
        admin_obj = User.objects.get(id=id)
        serializer = UserSerializer(admin_obj)
        return Response(serializer.data)
    except User.DoesNotExist:
        return Response({"error": "This user is not found"}, status=404)

@api_view(['DELETE'])
def delete_user(request, id):
    try:
        admin_obj = User.objects.get(id=id)
        admin_obj.delete()
        Notification.objects.create(
            message=f"User {admin_obj.first_name} {admin_obj.last_name} has been deleted."
        )
        return Response({"message": "user deleted successfully"}, status=204)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=404)


class UserUpdateView(APIView):
    def put(self, request, id):
        try:
            admin = User.objects.get(id=id)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = UserSerializer(admin, data=request.data, partial=True)

        if serializer.is_valid():
          
            serializer.save()
       
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_subscription(request):
    try:
        data = request.data.copy()
        owners_raw = data.get('owners')

        if isinstance(owners_raw, str):
           
            try:
                owners_data = json.loads(owners_raw)
            except json.JSONDecodeError:
                return Response({"owners": ["Invalid JSON format."]}, status=400)
        else:
            owners_data = owners_raw

        if ( 
            isinstance(owners_data, list) and len(owners_data) == 1 
            and isinstance(owners_data[0], str)
        ):
            try:
                owners_data = json.loads(owners_data[0])
            except json.JSONDecodeError:
                return Response({"owners": ["Nested JSON format is invalid."]}, status=400)

        if not (isinstance(owners_data, list) and all(isinstance(o, dict) for o in owners_data)):
            return Response({"owners": ["Owners must be a list of objects."]}, status=400)

        data['owners'] = owners_data



        serializer = SubscriptionsSerializer(data=data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        subscription = serializer.save() 
        subscription = Subscriptions.objects.get(id=subscription.id)

        owner_names = [f"{o.first_name} {o.last_name}" for o in subscription.owners.all()]
        Notification.objects.create(
            recipient=request.user,
            message=f"Subscription '{subscription.sub_type}' was created for {', '.join(owner_names)}."
        )

        return Response(SubscriptionsSerializer(subscription).data, status=201)

    except serializers.ValidationError as ve:
        return Response(ve.detail, status=400)

    except Exception as e:
        return Response({'error': str(e)}, status=400)



class SubscriptionsViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Subscriptions.objects.all().select_related('user') 
    serializer_class = SubscriptionsSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    
    filterset_fields = ['sub_type', 'owners__email', 'expiring_date']
    search_fields = ['sub_type', 'owners__first_name', 'owners__last_name']
    
    def get_queryset(self):
        print("HEADERS:", self.request.headers)

        status = self.request.query_params.get('status')
        if status == 'active':
            return Subscriptions.objects.active()
        elif status == 'expired':
            return Subscriptions.objects.expired()
        elif status == 'pending':
            return Subscriptions.objects.pending()
        return Subscriptions.objects.all()



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_subscriptions(request):
    licenses = Subscriptions.objects.all()
    serializer = SubscriptionsSerializer(licenses, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_subscriptions(request, id):
    try:
        license_obj = Subscriptions.objects.get(id=id)
        serializer = SubscriptionsSerializer(license_obj)
        return Response(serializer.data)
    except Subscriptions.DoesNotExist:
        return Response({"error": "This subscription not found"}, status=404)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_subscriptions(request, id):
    try:
        license_obj = Subscriptions.objects.get(id=id)
        owner_names = ", ".join([f"{o.first_name} {o.last_name}" for o in license_obj.owners.all()])
        license_obj.delete()
        Notification.objects.create(
            message=f"Subscription '{license_obj.sub_type}' owned by {owner_names} was deleted."
        )
        return Response({"message": "Subscription deleted successfully"}, status=204)
    except Subscriptions.DoesNotExist:
        return Response({"error": "Subscription not found"}, status=404)



class SubscriptionsUpdateView(APIView):
    def put(self, request, id):
        try:
            license = Subscriptions.objects.get(id=id)
        except Subscriptions.DoesNotExist:
            return Response({'error': 'SUbscriprion not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = SubscriptionsSerializer(license, data=request.data, partial=True)

        if serializer.is_valid():
          
            serializer.save()
       
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['POST'])
def trigger_email(request):

    try:
        send_subscription_reminder.delay()
        return Response({"message": "Email Notification triggered!"}, status=200)

    except Exception as e:

        return Response({"error": str(e)}, status=500)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_subscription_expiry_notification(request, subscription_id):
    subscription = get_object_or_404(Subscriptions, id=subscription_id)

    try:
        exp_date = subscription.expiring_date
        if isinstance(exp_date, str):
            exp_date = datetime.strptime(exp_date, "%Y-%m-%d").date()

        if exp_date <= date.today() + timedelta(days=7):
            admins = User.objects.filter(userRole='admin')
            employees = Employees.objects.filter(assigned_subscriptions=subscription)

            for employee in employees:
                message = f"{employee.firstName} {employee.lastName}'s subscription for {subscription.sub_type} is expiring on {exp_date}."
                for admin in admins:
                    Notification.objects.create(recipient=admin, message=message)

            return JsonResponse({"message": "Notifications created for employees and admins."})
        else:
            return JsonResponse({"message": "No notifications needed. Subscription is not expiring soon."})

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def mark_notification_as_read(request, notification_id):
    notification = get_object_or_404(Notification, id=notification_id)
    notification.read = True
    notification.save()
    return JsonResponse({"message": "Notification marked as read"})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_notifications(request):
    user = request.user
    five_days_ago = timezone.now() - timedelta(days=5)

    if getattr(user, 'userRole', None) == 'admin':
        notifications = Notification.objects.filter(created_at__gte=five_days_ago).order_by('-created_at')
    else:
        notifications = Notification.objects.filter(recipient=user, created_at__gte=five_days_ago).order_by('-created_at')

    data = [
        {
            'id': n.id,
            'message': n.message,
            'created_at': n.created_at,
            'read': n.read,
        } for n in notifications
    ]
    return JsonResponse({"notifications": data})



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_unread_notifications(request):
    user = request.user
    five_days_ago = timezone.now() - timedelta(days=5)

    if getattr(user, 'userRole', None) == 'admin':
        notifications = Notification.objects.filter(read=False, created_at__gte=five_days_ago).order_by('-created_at')
    else:
        notifications = Notification.objects.filter(recipient=user, read=False, created_at__gte=five_days_ago).order_by('-created_at')

    data = [
        {
            'id': n.id,
            'message': n.message,
            'created_at': n.created_at,
            'read': n.read,
        } for n in notifications
    ]
    return JsonResponse({"unread_notifications": data})



@api_view(['POST'])
@parser_classes([MultiPartParser])
def renew_subscriptions(request, id):
    license = Subscriptions.objects.get(id=id)

    new_expiry = request.data.get('new_expiry_date')
    sub_type = request.data.get('sub_type')
    issuing_authority = request.data.get('issuing_authority')
    notes = request.data.get('notes')
    renewal_document = request.FILES.get('renewal_document')

    try:
        license.expiring_date = new_expiry
        license.status = 'active'
        license.sub_type = sub_type
        license.issuing_authority = issuing_authority
        license.notes = notes
        if renewal_document:
            license.renewal_document = renewal_document  
        license.save()
        Notification.objects.create(
            recipient=request.user,
            message=f"Subscription '{license.sub_type}' has been renewed and is now active until {license.expiring_date}."
        )
        return Response({"message": "Subscription renewed."})
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


def generate_otp_token(user, otp):
    payload = {
        "email": user.email,
        "otp": otp,
        "exp": datetime.utcnow() + timedelta(minutes=5),
        "iat": datetime.utcnow(),
        "jti": str(uuid.uuid4())  
    }
    token = jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")
    return token

class SignInView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        print(f"Attempting to authenticate user: {email}")
        email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'

        try:
            if not re.match(email_pattern, email):
                raise AuthenticationFailed('Invalid email format')

            user = get_user_model().objects.get(email=email)
            print(f"User found: {user}")

            if not getattr(user, 'password_set', False):
                return Response({
                    'message': 'Password not set. Please create a password.',
                    'user_id': user.id,
                        'redirect': 'set-password'
                }, status=200)

            if user.check_password(password):
                print("Password is correct")

                otp = random.randint(100000, 999999)
                otp_token = generate_otp_token(user, otp)

                first = user.first_name or ""
                last = user.last_name or ""
                greeting_name = f"{first} {last}".strip()
                if not greeting_name:
                    greeting_name = user.email

                subject = "Your OTP Code"
                from_email = settings.DEFAULT_FROM_EMAIL
                to = [user.email]

                text_content = f"""
ABC ForBetterChoice
Hi {greeting_name},

Your passcode is: {otp}
It is valid for 15 minutes.
Please enter this passcode in the sign in page.
"""

                html_content = f"""
<html>
<body style="margin:0; padding:0; font-family: Arial, sans-serif; background-color: #fff;">
    <table width="100%" height="100%" cellpadding="0" cellspacing="0" style="background-color:#fff;">
        <tr>
            <td align="center" valign="middle">
                <table width="100%" max-width="480" cellpadding="20" cellspacing="0" style="background-color:#ffffff; border-radius:8px; box-shadow:0 2px 5px rgba(0,0,0,0.1);">
                    <tr>
                        <td align="center" style="font-size: 28px; font-weight: bold; color: #1e3a8a; padding-bottom: 20px;">
                            Amazingly.Better.Choice
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="font-size: 18px; color: #333333; padding-bottom: 10px;">
                            Hi {greeting_name},
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="font-size: 20px; font-weight: bold; color: #444; padding-bottom: 10px;">
                            Your passcode is: <span style="color:#000000;">{otp}</span>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="font-size: 14px; color: #444; padding-bottom: 5px;">
                            It is valid for 15 minutes.
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="font-size: 14px; color: #444;">
                            Please enter this passcode in the sign in page.
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
"""

                msg = EmailMultiAlternatives(subject, text_content, from_email, to)
                msg.attach_alternative(html_content, "text/html")
                msg.send()


                return Response({
                    'message': 'OTP sent to your email',
                    'otp_token': otp_token
                }, status=HTTP_200_OK)
            else:
                print("Password is incorrect")
                raise AuthenticationFailed('Invalid credentials')

        except get_user_model().DoesNotExist:
            print(f"User with email {email} does not exist")
            raise AuthenticationFailed('User does not exist')


@api_view(['POST'])
@permission_classes([AllowAny])
def set_user_password(request):
    print("Incoming data:", request.data)

    user_id = request.data.get('user_id')
    new_password = request.data.get('new_password')

    if not user_id or not new_password:
        return Response({'error': 'user_id and new_password are required'}, status=400)


    try:
        user = get_user_model().objects.get(id=user_id)

        if user.has_usable_password():
            return Response({'error': 'Password is already set'}, status=400)

        user.set_password(new_password)
        user.save() 
        return Response({'message': 'Password set successfully'}, status=200)
    except get_user_model().DoesNotExist:
        return Response({'error': 'User not found'}, status=404)



class VerifyOTPView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        otp_token = request.data.get("otp_token")
        input_otp = request.data.get("otp")

        if not otp_token or not input_otp:
            raise ValidationError("OTP token and OTP code are required.")

        try:
            payload = jwt.decode(otp_token, settings.SECRET_KEY, algorithms=["HS256"])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed("OTP token expired.")
        except jwt.InvalidTokenError:
            raise AuthenticationFailed("Invalid OTP token.")

        if str(payload.get("otp")) != str(input_otp):
            raise AuthenticationFailed("Invalid OTP")

        email = payload.get("email")
        try:
            user = get_user_model().objects.get(email=email)
        except get_user_model().DoesNotExist:
            raise AuthenticationFailed("User not found")

        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)

        return Response({
            "message": "OTP verified successfully",
            "access_token": access_token,
            "refresh_token": str(refresh),
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
            }
        }, status=HTTP_200_OK)


class ResendOTPView(APIView):
    def post(self, request):
        otp_token = request.data.get("otp_token")

        if not otp_token:
            raise ValidationError("OTP token is required.")

        try:
            payload = jwt.decode(otp_token, settings.SECRET_KEY, algorithms=["HS256"], options={"verify_exp": False})
        except jwt.InvalidTokenError:
            raise ValidationError("Invalid OTP token.")

        user_email = payload.get("email")

        try:
            user = get_user_model().objects.get(email=email)
        except get_user_model().DoesNotExist:
            raise ValidationError("User not found.")

        new_otp = random.randint(100000, 999999)
        new_otp_token = generate_otp_token(user, new_otp)

        send_mail(
            subject="Your New OTP Code",
            message=f"Your new OTP code is: {new_otp}",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user_email],
            fail_silently=False,
        )

        return Response({
            "message": "New OTP has been sent to your email",
            "otp_token": new_otp_token
        }, status=HTTP_200_OK)


class SignUpView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        try:

            if User.objects.exists():
                return JsonResponse({"error": "Registration is disabled. A user already exists."}, status=403)


            data = json.loads(request.body.decode('utf-8'))
            print("Received Data:", data) 
           
            required_fields = [ "password", "first_name", "last_name", "email"]
            for field in required_fields:
                if field not in data or not data[field]:
                    return JsonResponse({"error": f"{field} is required"}, status=400)


            user = User(
                first_name=data["first_name"],
                last_name=data["last_name"],
                mobiNumber=data.get("phone_number"),
                email=data["email"]
            )
                
            user.set_password(data["password"]) 
            user.save()

            print(f"User {user.email} saved successfully!")

            return JsonResponse({"message": "User created successfully"}, status=201)

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON format"}, status=400)
       
        except Exception as e:   
            print(f"Error: {str(e)}")
            return JsonResponse({"error": "An unexpected error occurred", "details": str(e)}, status=500)


class ForgotPasswordView(APIView):
    def post(self, request):
        email = request.data.get('email')
        try:
            user = User.objects.get(email=email)
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            token = PasswordResetTokenGenerator().make_token(user)
            reset_link = f"http://127.0.0.1:3000/reset_password/{uid}/{token}/"

            send_mail(
                subject="Reset Your Password",
                message=f"Click the link to reset your password: {reset_link}",
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[user.email],
                fail_silently=False,
            )

            return Response({"message": "Password reset link sent"}, status=status.HTTP_200_OK)
        except Users.DoesNotExist:
            return Response({"error": "Email not found"}, status=status.HTTP_404_NOT_FOUND)


class ResetPasswordView(APIView):
    def post(self, request, uidb64, token):
        password = request.data.get("password")  
        try:
            
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = get_user_model().objects.get(id=uid)

         
            if PasswordResetTokenGenerator().check_token(user, token):
                user.set_password(password)  
                user.save()  
                return Response({"message": "Password reset successful"}, status=status.HTTP_200_OK)
            else:
                return Response({"error": "Invalid or expired token"}, status=status.HTTP_400_BAD_REQUEST)

        except (get_user_model().DoesNotExist, ValueError, TypeError):
            return Response({"error": "Invalid request"}, status=status.HTTP_400_BAD_REQUEST)


class FullReportAPIView(APIView):
       def get(self, request):
        metrics = Subscriptions.objects.aggregate(
            total_subscriptions=Count('id'),
            active_subscriptions=Count('id', filter=Q(expiring_date__gte=now().date())),
            expired_subscriptions=Count('id', filter=Q(expiring_date__lt=now().date())),
            total_revenue=Sum('amount')
        )
        list_data = list(Subscriptions.objects.values(
            'issuing_authority', 'sub_type', 'amount', 'issuing_date', 'expiring_date'
        ))

        return Response({
            'metrics': metrics,
            'list': list_data
        })


class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]
   
    def get(self, request):
        print("Authorization Header:", request.headers.get('Authorization'))
        print("User:", request.user)
        print("Is Authenticated:", request.user.is_authenticated)
        
        user = request.user
        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request):
        user = request.user
        user_data = request.data

        serializer = UserSerializer(user, data=user_data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])

@parser_classes([MultiPartParser])
def renew_subscription(request, id):
    try:
        subs_obj = Subscriptions.objects.get(id=id)
    except Subscriptions.DoesNotExist:
        return Response({"error": "Subscription not found."}, status=status.HTTP_404_NOT_FOUND)

    
    renewal_date_str = request.data.get('renewal_date') 
    new_expiry_str = request.data.get('new_expiry_date')
    sub_type = request.data.get('subscription_type')
    issuing_authority = request.data.get('provider')
    notes = request.data.get('notes')
    paid_amount = request.data.get('paid_amount')
    renewal_document = request.FILES.get('renewal_document')

    try:
        renewal_date = datetime.strptime(renewal_date_str, '%Y-%m-%d').date() if renewal_date_str else None
        new_expiry = datetime.strptime(new_expiry_str, '%Y-%m-%d').date() if new_expiry_str else None
    except ValueError:
        return Response({"error": "Invalid date format. Use YYYY-MM-DD."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        if new_expiry:
            subs_obj.expiring_date = new_expiry
        if sub_type:
            subs_obj.sub_type = sub_type
        if issuing_authority:
            subs_obj.issuing_authority = issuing_authority
        if notes is not None:
            subs_obj.notes = notes
        if paid_amount:
            subs_obj.amount = paid_amount
        if renewal_document:
            subs_obj.associated_documents = renewal_document

        subs_obj.status = 'active'
        subs_obj.save()

        Renewing.objects.create(
            subscriptions=subs_obj,
            renewed_by=request.user if request.user.is_authenticated else None,
            renewal_date=renewal_date or datetime.today().date(),
            new_expiry_date=new_expiry or subs_obj.expiring_date,
            paid_amount=paid_amount if paid_amount else subs_obj.amount,
            receipt=renewal_document,
            notes=notes,
        )

        return Response({"message": "Subscription renewed successfully."})
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class ForgotPasswordView(APIView):
    def post(self, request):
        email = request.data.get('email')
        try:
            user = Users.objects.get(email=email)
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            token = PasswordResetTokenGenerator().make_token(user)
            reset_link = f"http://127.0.0.1:3000/reset_password/{uid}/{token}/"

            send_mail(
                subject="Reset Your Password",
                message=f"Click the link to reset your password: {reset_link}",
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[user.email],
                fail_silently=False,
            )

            return Response({"message": "Password reset link sent"}, status=status.HTTP_200_OK)
        except Users.DoesNotExist:
            return Response({"error": "Email not found"}, status=status.HTTP_404_NOT_FOUND)


class ResetPasswordView(APIView):
    def post(self, request, uidb64, token):
        password = request.data.get("password")  
        try:
            
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = get_user_model().objects.get(id=uid)

         
            if PasswordResetTokenGenerator().check_token(user, token):
                user.set_password(password)  
                user.save()  
                return Response({"message": "Password reset successful"}, status=status.HTTP_200_OK)
            else:
                return Response({"error": "Invalid or expired token"}, status=status.HTTP_400_BAD_REQUEST)

        except (get_user_model().DoesNotExist, ValueError, TypeError):
            return Response({"error": "Invalid request"}, status=status.HTTP_400_BAD_REQUEST)



def html_report(request):
    dept_data = defaultdict(lambda: {'subscriptions_count': 0, 'owners': set()})
    for sub in Subscriptions.objects.prefetch_related('owners').all():
        for owner in sub.owners.all():
            dept = owner.department
            dept_data[dept]['subscriptions_count'] += 1
            dept_data[dept]['owners'].add(owner.email)

    departments = []
    for dept, values in dept_data.items():
        departments.append({
            'department': dept,
            'subscriptions_count': values['subscriptions_count'],
            'owners_count': len(values['owners']),
        })

    issuing_data = defaultdict(lambda: {'subscriptions_count': 0, 'total_amount': 0})
    for sub in Subscriptions.objects.all():
        auth = sub.issuing_authority
        issuing_data[auth]['subscriptions_count'] += 1
        issuing_data[auth]['total_amount'] += sub.amount or 0

    subscriptions = []
    for auth, values in issuing_data.items():
        subscriptions.append({
            'issuing_authority': auth,
            'subscriptions_count': values['subscriptions_count'],
            'total_amount': values['total_amount'],

        })

    total_expenditure = sum(sub['total_amount'] for sub in subscriptions)

    download_format = request.GET.get("download")

    if download_format == "pdf":
        logo_path = 'file://' + '/home/Sali/Documents/License_Renew_Track_System/license-renew-frontend/public/ABC1.png'
    else:
        logo_path = ''

    context = {
        'logo_path': logo_path,
        'header': 'African Banking Coraparation Ltd.',
        'address': 'ABC Bank House, Westlands <br/>'
                    'P. O. Box 13889 – 00800, Nairobi, Kenya.<br/>'
                    'Tel: +254 (20) 4263000, 4447352, 4447353 <br/>'
                    'Email: talk2us@abcthebank.com <br/>',
        'heading': 'Renewal Compliance Report',
        'departments': departments,
        'subscriptions': subscriptions,
        'total_expenditure': total_expenditure,
        'footer': 'African Banking Corporation Limited is regulated by the Central Bank of Kenya'
    }


    if download_format == "csv":
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="compliance_report.csv"'

     
        response.write(codecs.BOM_UTF8)

        writer = csv.writer(response)

        writer.writerow(['Department', 'Number of Subscriptions', 'Number of Owners'])
        for dept in departments:
            writer.writerow([dept['department'], dept['subscriptions_count'], dept['owners_count']])
        
        writer.writerow([])  

        writer.writerow(['Issuing Authority', 'Total Subscriptions', 'Total Amount'])
        for sub in subscriptions:
            writer.writerow([sub['issuing_authority'], sub['subscriptions_count'], sub['total_amount']])

        return response

 
    template = loader.get_template('report_template.html')
    html_content = template.render(context)

    if download_format == "pdf":
        with tempfile.NamedTemporaryFile(delete=True, suffix=".pdf") as output:
            HTML(string=html_content, base_url=request.build_absolute_uri()).write_pdf(output.name)
            output.seek(0)
            response = HttpResponse(output.read(), content_type='application/pdf')
            response['Content-Disposition'] = 'attachment; filename="compliance_report.pdf"'
            return response

    
    return HttpResponse(html_content)


class SignOutView(APIView):
    permission_classes = [IsAuthenticated] 

    def post(self, request):
        try:
            refresh_token = request.data.get("refresh_token")
            if not refresh_token:
                return Response({"error": "Refresh token is required"}, status=status.HTTP_400_BAD_REQUEST)

            token = RefreshToken(refresh_token)
            token.blacklist() 

            return Response({"message": "Successfully logged out"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


LOG_FILE_PATH = "/home/Sali/Documents/License_Renew_Track_System/LicenseRenew/logs"  

def parse_log_line(line):

    try:
        parts = line.strip().split(' ', 4)
        if len(parts) < 5:
            return None
        timestamp_str = parts[0] + ' ' + parts[1] 
        timestamp = datetime.strptime(timestamp_str, '%Y-%m-%d %H:%M:%S,%f')
        level = parts[2]
        user = parts[3]
        message = parts[4]
        return {
            'timestamp': timestamp.isoformat(),
            'level': level,
            'user': user,
            'message': message
        }
    except Exception:
        return None

@api_view(['GET'])
def logs_from_file(request):
    page = int(request.GET.get('page', 1))
    page_size = int(request.GET.get('page_size', 20))

    if not os.path.exists(LOG_FILE_PATH):
        return JsonResponse({'error': 'Log file not found'}, status=404)

   
    with open(LOG_FILE_PATH, 'r') as f:
        lines = f.readlines()

    
    logs = [parse_log_line(line) for line in lines]
    logs = [log for log in logs if log]  

    logs.sort(key=lambda x: x['timestamp'], reverse=True)

    total = len(logs)
    total_pages = math.ceil(total / page_size)

    if page < 1 or page > total_pages:
        return JsonResponse({'error': 'Invalid page number'}, status=400)

    start = (page - 1) * page_size
    end = start + page_size
    page_logs = logs[start:end]

    response = {
        'results': page_logs,
        'total': total,
        'total_pages': total_pages,
        'page': page,
        'page_size': page_size
    }
    return JsonResponse(response)