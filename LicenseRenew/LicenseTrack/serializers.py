from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from drf_writable_nested import WritableNestedModelSerializer
# from .models import Subscription, Users, Renewals, Providers, User_Profile

#----v2----#
from .models import User, Subscriptions, Notification, Renewing
from datetime import datetime

# class ProvidersSerializer(serializers.ModelSerializer):

#     class Meta:
#         model = Providers
#         fields =  '__all__'

# class UsersSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Users
#         fields = ['id', 'username', 'password', 'first_name', 'middle_name', 'last_name', 'phone_number', 'email']

# class SubscriptionSerializer(WritableNestedModelSerializer, serializers.ModelSerializer):
#     providers = serializers.CharField(source='providers.service_provider')
#     users = UsersSerializer()
    

#     class Meta:
#         model = Subscription
#         fields = '__all__'

#     def update(self, instance, validated_data):
#         providers_data = validated_data.pop('providers', None)
#         if providers_data:
#             provider_instance = instance.providers
#             for attr, value in providers_data.items():
#                 setattr(provider_instance, attr, value)
#             provider_instance.save()

#         validated_data.pop('users', None)

#         for attr, value in validated_data.items():
#             setattr(instance, attr, value)

#         instance.save()  
#         return instance


# class User_ProfileSerializer(serializers.ModelSerializer):
#     user = UsersSerializer(read_only=True)

#     class Meta:
#         model = User_Profile
#         fields = '__all__'

#     def update(self, instance, validated_data):
#         user_data = validated_data.pop('user', {})

#         instance.bio = validated_data.get('bio', instance.bio)
#         instance.address_line1 = validated_data.get('address_line1', instance.address_line1)
#         instance.address_line2 = validated_data.get('address_line2', instance.address_line2)
#         instance.postcode = validated_data.get('postcode', instance.postcode)
#         instance.state = validated_data.get('state', instance.state)
#         instance.country = validated_data.get('country', instance.country)
#         instance.region = validated_data.get('region', instance.region)


#         if 'profile_picture' in validated_data:
#             instance.profile_picture = validated_data['profile_picture']

#         instance.save()
#         return instance



# class SignUpSerializer(serializers.ModelSerializer):
#     password = serializers.CharField(write_only=True)

#     class Meta:
#         model = Users
#         fields = ['username', 'name', 'phone_number', 'email', 'password']

#     def create(self, validated_data):
#         user = Users(
#             username=validated_data['username'],
#             name=validated_data['name'],
#             phone_number=validated_data.get('phone_number', ''),
#             email=validated_data['email']
#         )
#         user.set_password(validated_data['password'])  
#         user.save()
#         return user

# class SignInSerializer(serializers.Serializer):
    
#     username = serializers.CharField(max_length=255, required=True)
    
#     password = serializers.CharField(write_only=True, required=True)




#------VERSION2------#

class UserSerializer(serializers.ModelSerializer):
    date_joined = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'password', 'first_name', 'last_name', 'email', 'mobiNumber', 'userRole', 'date_joined']


    def get_date_joined(self, obj):
        
        return obj.date_joined.date().isoformat()

class SubscriptionsSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True) 
    status = serializers.CharField(read_only=True)
    
    class Meta:
        model = Subscriptions
        fields = ['user', 'id', 'sub_name', 'sub_type', 'issuing_authority', 'issuing_date', 'expiring_date', 'amount', 
                  'reference', 'owner_first_name', 'owner_last_name', 'owner_email', 'owner_department', 
                  'associated_documents', 'is_document_uploaded', 'status']

        read_only_fields = ['user', 'is_document_uploaded']

    def create(self, validated_data):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            validated_data['user'] = request.user
        return super().create(validated_data)


    

class NotificationSerializer(serializers.ModelSerializer):
    recipient = serializers.StringRelatedField()

    class Meta:
        model = Notification
        fields = ['id', 'recipient', 'message', 'read', 'created_at']


class RenewingSerializer(serializers.ModelSerializer):
    subscriptions = SubscriptionsSerializer(read_only=True)
    renewed_by = UserSerializer(read_only=True)
    receipt = serializers.FileField(required=False)

    class Meta:
        model = Renewing
        fields = [
            'id', 'subscriptions', 'renewed_by', 'renewal_date',
            'new_expiry_date', 'paid_amount', 'receipt', 'notes'
        ]