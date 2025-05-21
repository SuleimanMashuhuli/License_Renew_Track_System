from django.urls import path
from django.urls import path, include
from django.contrib.auth.views import LoginView 
from rest_framework.routers import DefaultRouter
# from .views import extract_text, CreateLicense, ForgotPasswordView, ResetPasswordView, generate_report, renew_subscription, trigger_email, list_software, get_software, delete_software, LicenseUpdateView, download_subscription
# from .views import SubscriptionReportAPIView, SubscriptionDataAPIView, SubscriptionTypeReportAPIView, ProvidersListAPIView, SignUpView, SignInView, SignOutView, LoggedUser, UserProfileView

from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


#-----v2-------#
from .views import create_admin, create_subscription, list_subscriptions, get_subscriptions, delete_subscriptions, SubscriptionsUpdateView, SubscriptionsViewSet, trigger_email, create_subscription_expiry_notification, mark_notification_as_read, get_notifications, get_unread_notifications
from .views import UserViewSet, get_current_user, get_user, delete_user, UserUpdateView, SignUpView, FullReportAPIView, renew_subscription
from .views import SignInView, VerifyOTPView, ResendOTPView, set_user_password, ForgotPasswordView, ResetPasswordView, UserProfileView, list_all_users  



# Router for ViewSet
router = DefaultRouter()
router.register(r'subscriptions', SubscriptionsViewSet, basename='subscriptions-viewset')
router.register(r'users', UserViewSet)

 


urlpatterns = [

    path('licenses/', include(router.urls)),

    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'), 

    #------v2------#
    path('user/sign_in/', SignInView.as_view(), name='sign_in'),
    path('user/verify_otp/', VerifyOTPView.as_view(), name='verify_otp'),
    path('user/resend_otp/', ResendOTPView.as_view(), name='resend_otp'),
    path('user/set_password/', set_user_password, name='set_password'),
    path('user/sign_up/', SignUpView.as_view(), name='sign_up'),
    path('forgot_password/', ForgotPasswordView.as_view(), name='forgot-password'),
    path('reset_password/<uidb64>/<token>/', ResetPasswordView.as_view(), name='reset-password'),


    # Admin
    path('admin/create/', create_admin, name='create_admin'),
    path('users/', list_all_users, name='list_all_users'),
    path('users/<int:id>/', get_user, name='get_user'), 
    path('users/<int:id>/delete/', delete_user, name='delete_user'),
    path('users/<int:id>/update/', UserUpdateView.as_view(), name='update_user'),
    path('me/', get_current_user, name='get_current_user'),


    # Subscriptions
    path('subscriptions/create/', create_subscription, name='create_subscription'),
    path('subscriptions/', list_subscriptions, name='list_subscriptions'),
    path('subscriptions/<int:id>/', get_subscriptions, name='get_subscription'),
    path('subscriptions/delete/<int:id>/', delete_subscriptions, name='delete_subscription'),
    path('subscriptions/update/<int:id>/', SubscriptionsUpdateView.as_view(), name='update_subscription'),
    path('subscriptions/notify/<int:subscription_id>/', create_subscription_expiry_notification, name='subscription_expiry_notify'),

    # Notifications
    path('notifications/', get_notifications, name='get_notifications'),
    path('notifications/unread/', get_unread_notifications, name='get_unread_notifications'),
    path('notifications/mark-read/<int:notification_id>/', mark_notification_as_read, name='mark_notification_as_read'),

    # Email trigger
    path('notifications/trigger-email/', trigger_email, name='trigger_email'),

    path('full-report/', FullReportAPIView.as_view(), name='fullreport'),

    path('profile/', UserProfileView.as_view(), name='user_profile'),

    path('renew/', renew_subscription, name='renew_subscription'),




   # path("api/license/extract/", extract_text, name="extract_text"),
    # path("api/license-add/", CreateLicense.as_view(), name="create_license"),
    # path('licenseS/', list_software, name='list_licenses'),  
    # path('licenseS/<int:id>/', get_software, name='get_license'),
    # path('license-triggerMail/', trigger_email, name='trigger_license'),
    # path('license-update/<int:id>/', LicenseUpdateView.as_view(), name='update_license'),
    # path('license-delete/<int:id>/', delete_software, name='delete_license'),
    # path('licenseS/download/<int:id>/', download_subscription, name="download_license"),

    # path('reports/subscription/', SubscriptionReportAPIView.as_view(), name='subscription_reports'),
    # path('reports/subscription-type/', SubscriptionTypeReportAPIView.as_view(), name='subscription_types'),
    # path('reports/providers/', ProvidersListAPIView.as_view(), name='providers_list'),
    # path('reports/subscription-data/', SubscriptionDataAPIView.as_view(), name='subscription_data'),
    # path("reports/generate/<str:format>/", generate_report, name="generate_report"),


    # path('user/sign_up/', SignUpView.as_view(), name='sign_up'),
    # path('user/sign_in/', SignInView.as_view(), name='api_sign_in'),
    # path('user/sign_out/', SignOutView.as_view(), name='api_sign_out'),
    # path('user/loggeduser/', LoggedUser.as_view(), name='api_sign_out'),

    # path('profile/', UserProfileView.as_view(), name='user_profile'),

    # path('renew/', renew_subscription, name='renew_subscription'),
    # path('forgot_password/', ForgotPasswordView.as_view(), name='forgot-password'),
    # path('reset_password/<uidb64>/<token>/', ResetPasswordView.as_view(), name='reset-password'),





]

urlpatterns = router.urls + urlpatterns 