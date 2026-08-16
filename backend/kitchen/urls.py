from django.urls import path

from .views import create_order, customer_list, home_data, order_list, register_customer, save_menu

urlpatterns = [
    path('api/home/', home_data, name='home_data'),
    path('api/register/', register_customer, name='register_customer'),
    path('api/menu/', save_menu, name='save_menu'),
    path('api/customers/', customer_list, name='customer_list'),
    path('api/orders/', order_list, name='order_list'),
    path('api/orders/create/', create_order, name='create_order'),
]
