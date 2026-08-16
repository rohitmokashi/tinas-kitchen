from django.contrib import admin

from .models import Customer, DailyMenu


@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = ('name', 'phone', 'area', 'email', 'created_at')
    search_fields = ('name', 'phone', 'area', 'email')
    list_filter = ('area', 'created_at')


@admin.register(DailyMenu)
class DailyMenuAdmin(admin.ModelAdmin):
    list_display = ('menu_date', 'breakfast', 'lunch', 'dinner', 'updated_at')
    list_filter = ('menu_date',)
    search_fields = ('breakfast', 'lunch', 'dinner')
