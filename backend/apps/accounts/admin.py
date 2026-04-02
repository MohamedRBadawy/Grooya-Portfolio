from django.contrib import admin

from apps.accounts.models import AccountProfile


@admin.register(AccountProfile)
class AccountProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'role', 'title', 'updated_at')
    list_filter = ('role',)
    search_fields = ('user__username', 'user__email', 'title')
