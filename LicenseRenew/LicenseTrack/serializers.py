from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from drf_writable_nested import WritableNestedModelSerializer
from .models import User, Owner,Subscriptions, Notification, Renewing
from datetime import datetime
from django.contrib.auth import get_user_model
import json



#------VERSION2------#
User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    date_joined = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'password', 'first_name', 'last_name', 'email', 'mobiNumber', 'userRole', 'date_joined']


    def get_date_joined(self, obj):
        
        return obj.date_joined.date().isoformat()

class OwnerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Owner
        fields = '__all__'

class SubscriptionsSerializer(serializers.ModelSerializer):
    # owners = OwnerSerializer(many=True, required=False)
    owners = serializers.ListField(write_only=True)

    status = serializers.CharField(read_only=True)
    
    class Meta:
        model = Subscriptions
        fields = '__all__'
        read_only_fields = ['user', 'is_document_uploaded', 'status']

    def validate_owners(self, value):
        if not isinstance(value, list) or len(value) == 0:
            raise serializers.ValidationError("At least one owner is required.")
        return value

    def create(self, validated_data):
        owners_data = validated_data.pop('owners', [])

        print("Owners data in serializer create:", owners_data)

        if isinstance(owners_data, list):
                if len(owners_data) == 1 and isinstance(owners_data[0], str):
                    try:
                        owners_data = json.loads(owners_data[0])  
                    except json.JSONDecodeError:
                        raise serializers.ValidationError("Invalid JSON format in owners.")

        if not isinstance(owners_data, list) or not all(isinstance(o, dict) for o in owners_data):
            raise serializers.ValidationError("Owners must be a list of objects.")


        subscription = Subscriptions.objects.create(**validated_data)

        for owner_data in owners_data:
            print("TYPE:", type(owner_data), "VALUE:", owner_data)
            owner, _ = Owner.objects.get_or_create(
                email=owner_data['email'],
                defaults={
                    'first_name': owner_data['first_name'],
                    'last_name': owner_data['last_name'],
                    'department': owner_data['department'],
                }
            )
            subscription.owners.add(owner)
            print(f"Added owner {owner.email} to subscription {subscription.id}")

        subscription.save()
        return subscription
    


    def to_representation(self, instance):
        """Return serialized subscription data with full owner details."""
        rep = super().to_representation(instance)
        rep['owners'] = OwnerSerializer(instance.owners.all(), many=True).data
        return rep  


    def update(self, instance, validated_data):
        owners_data = validated_data.pop('owners', None)

        
        if owners_data is not None:
            if isinstance(owners_data, list):
                if len(owners_data) == 1 and isinstance(owners_data[0], str):
                    try:
                        owners_data = json.loads(owners_data[0])
                    except json.JSONDecodeError:
                        raise serializers.ValidationError("Invalid JSON format in owners.")

            if not isinstance(owners_data, list) or not all(isinstance(o, dict) for o in owners_data):
                raise serializers.ValidationError("Owners must be a list of objects.")

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if owners_data is not None:
            instance.owners.clear()
            for owner_data in owners_data:
                owner, _ = Owner.objects.get_or_create(
                    email=owner_data['email'],
                    defaults={
                        'first_name': owner_data['first_name'],
                        'last_name': owner_data['last_name'],
                        'department': owner_data['department'],
                    }
                )
                instance.owners.add(owner)

        return instance



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