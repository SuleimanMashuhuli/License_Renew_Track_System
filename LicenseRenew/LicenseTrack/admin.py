from django.contrib import admin    
# from .models import Users, Providers, Subscription, Renewals

#----V2-----#
from .models import User, Subscriptions, Notification



# class UsersAdmin(admin.ModelAdmin):
#     list_display = ('first_name', 'middle_name', 'last_name', 'username', 'phone_number', 'email')
#     search_fields = ('first_name', 'middle_name', 'last_name', 'email')


# class ProvidersAdmin(admin.ModelAdmin):
#     list_display = ('service_provider', 'address', 'description')
#     search_fields = ('service_provider',)


# class SubscriptionAdmin(admin.ModelAdmin):
#     list_display = ('subscription_type', 'amount_paid', 'duration', 'issue_date', 'expiry_date', 'status', 'providers', 'users')
#     search_fields = ('subscription_type', 'providers__service_provider', 'users__name', 'status')
#     list_filter = ('subscription_type', 'providers', 'status')


# class RenewalsAdmin(admin.ModelAdmin):
#     list_display = (
#         'subscription', 'renewal_date', 'old_expiry_date', 'new_expiry_date', 'paid_amount', 'receipt', 'renewed_by'
#     )
#     search_fields = (
#         'subscription__users__username', 'subscription__providers__service_provider', 'renewed_by__username'
#     )
#     list_filter = ('renewal_date', 'renewed_by')
#     date_hierarchy = 'renewal_date'


# admin.site.register(Users, UsersAdmin)
# admin.site.register(Providers, ProvidersAdmin)
# admin.site.register(Subscription, SubscriptionAdmin)
# admin.site.register(Renewals, RenewalsAdmin)




#--------VERSION2---------#
@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'first_name', 'last_name', 'mobiNumber', 'userRole', 'is_staff', 'is_superuser')
    list_filter = ('userRole', 'is_staff', 'is_superuser')
    search_fields = ('username', 'email', 'first_name', 'last_name')


@admin.register(Subscriptions)
class SubscriptionsAdmin(admin.ModelAdmin):
    list_display = (
        'sub_type', 'owner_first_name', 'owner_last_name',
        'owner_email', 'owner_department', 'issuing_date',
        'expiring_date', 'amount', 'user', 'is_document_uploaded',
        'status_display'
    )
    list_filter = ('expiring_date', 'owner_department', 'is_document_uploaded')
    search_fields = ('sub_type', 'owner_email', 'owner_first_name', 'owner_last_name')

    def status_display(self, obj):
        return obj.status()
    status_display.short_description = 'Status'


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('recipient', 'message', 'read', 'created_at')
    list_filter = ('read', 'created_at')
    search_fields = ('recipient__username', 'message')  