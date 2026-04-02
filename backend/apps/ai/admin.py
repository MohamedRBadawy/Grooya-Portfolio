from django.contrib import admin

from apps.ai.models import AIEntitlementPolicy, AIProviderSetting, AIUsageRecord


@admin.register(AIEntitlementPolicy)
class AIEntitlementPolicyAdmin(admin.ModelAdmin):
    list_display = ('tier', 'feature', 'monthly_quota', 'enabled', 'heavy_action')
    list_filter = ('tier', 'enabled', 'heavy_action')
    search_fields = ('feature', 'description')


@admin.register(AIProviderSetting)
class AIProviderSettingAdmin(admin.ModelAdmin):
    list_display = ('provider', 'is_default', 'enabled', 'updated_at')
    list_filter = ('provider', 'enabled', 'is_default')


@admin.register(AIUsageRecord)
class AIUsageRecordAdmin(admin.ModelAdmin):
    list_display = ('feature', 'provider', 'status', 'user', 'session_key', 'created_at')
    list_filter = ('feature', 'provider', 'status')
    search_fields = ('session_key', 'error_message')

