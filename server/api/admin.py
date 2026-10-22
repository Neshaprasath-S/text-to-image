from django.contrib import admin
from .models import User, Transaction

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'email', 'credit_balance', 'created_at')
    search_fields = ('name', 'email')
    list_filter = ('created_at',)
    readonly_fields = ('created_at',)

@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'plan', 'amount', 'credits', 'payment', 'date', 'created_at')
    search_fields = ('user__name', 'user__email', 'plan')
    list_filter = ('payment', 'plan', 'created_at')
    readonly_fields = ('created_at',)
