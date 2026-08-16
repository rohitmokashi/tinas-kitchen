from datetime import timedelta

from django.http import JsonResponse
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt

from .models import Customer, DailyMenu, Order


FIXED_PRICES = {
    'breakfast': 50,
    'lunch': 150,
    'dinner': 150,
}


def home_data(request):
    today = timezone.localdate()
    tomorrow = today + timedelta(days=1)

    today_menu = DailyMenu.objects.filter(menu_date=today).first()
    tomorrow_menu = DailyMenu.objects.filter(menu_date=tomorrow).first()

    payload = {
        'kitchen_name': 'Tinas Wholesome kitchen',
        'service_area': 'Hinjewadi Phase 1, Pune',
        'fixed_prices': FIXED_PRICES,
        'today_menu': {
            'date': today.isoformat(),
            'breakfast': today_menu.breakfast if today_menu else 'Menu not updated yet',
            'lunch': today_menu.lunch if today_menu else 'Menu not updated yet',
            'dinner': today_menu.dinner if today_menu else 'Menu not updated yet',
        },
        'tomorrow_menu': {
            'date': tomorrow.isoformat(),
            'breakfast': tomorrow_menu.breakfast if tomorrow_menu else 'Menu not updated yet',
            'lunch': tomorrow_menu.lunch if tomorrow_menu else 'Menu not updated yet',
            'dinner': tomorrow_menu.dinner if tomorrow_menu else 'Menu not updated yet',
        },
    }
    return JsonResponse(payload)


@csrf_exempt
def register_customer(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Only POST requests are allowed.'}, status=405)

    name = request.POST.get('name', '').strip()
    phone = request.POST.get('phone', '').strip()
    area = request.POST.get('area', '').strip()
    email = request.POST.get('email', '').strip()

    if not name or not phone:
        return JsonResponse({'error': 'Name and phone are required.'}, status=400)

    customer = Customer.objects.create(name=name, phone=phone, area=area, email=email or None)
    return JsonResponse({
        'message': 'Customer registered successfully',
        'customer': {
            'id': customer.id,
            'name': customer.name,
            'phone': customer.phone,
            'area': customer.area,
            'email': customer.email,
        }
    }, status=201)


@csrf_exempt
def save_menu(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Only POST requests are allowed.'}, status=405)

    menu_date = request.POST.get('date', timezone.localdate().isoformat())
    breakfast = request.POST.get('breakfast', '').strip()
    lunch = request.POST.get('lunch', '').strip()
    dinner = request.POST.get('dinner', '').strip()

    if not breakfast or not lunch or not dinner:
        return JsonResponse({'error': 'Breakfast, lunch, and dinner are required.'}, status=400)

    menu_item, _ = DailyMenu.objects.update_or_create(
        menu_date=menu_date,
        defaults={'breakfast': breakfast, 'lunch': lunch, 'dinner': dinner},
    )

    return JsonResponse({
        'message': 'Menu updated successfully',
        'menu': {
            'date': menu_item.menu_date.isoformat(),
            'breakfast': menu_item.breakfast,
            'lunch': menu_item.lunch,
            'dinner': menu_item.dinner,
        }
    })


def customer_list(request):
    customers = Customer.objects.order_by('-created_at')
    return JsonResponse({
        'customers': [
            {
                'id': customer.id,
                'name': customer.name,
                'phone': customer.phone,
                'area': customer.area,
                'email': customer.email,
                'created_at': customer.created_at.isoformat(),
            }
            for customer in customers
        ]
    })


def order_list(request):
    orders = Order.objects.select_related('customer').order_by('-created_at')
    return JsonResponse({
        'orders': [
            {
                'id': order.id,
                'customer_id': order.customer.id,
                'customer_name': order.customer.name,
                'meal_type': order.meal_type,
                'quantity': order.quantity,
                'total_price': float(order.total_price),
                'status': order.status,
                'created_at': order.created_at.isoformat(),
            }
            for order in orders
        ]
    })


@csrf_exempt
def create_order(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Only POST requests are allowed.'}, status=405)

    customer_id = request.POST.get('customer_id')
    meal_type = request.POST.get('meal_type', '').strip()
    quantity = int(request.POST.get('quantity', 1) or 1)
    status = request.POST.get('status', 'pending').strip()

    if not customer_id or meal_type not in FIXED_PRICES:
        return JsonResponse({'error': 'Customer and valid meal type are required.'}, status=400)

    try:
        customer = Customer.objects.get(id=customer_id)
    except Customer.DoesNotExist:
        return JsonResponse({'error': 'Customer not found.'}, status=404)

    order = Order.objects.create(
        customer=customer,
        meal_type=meal_type,
        quantity=quantity,
        total_price=FIXED_PRICES[meal_type] * quantity,
        status=status,
    )

    return JsonResponse({
        'message': 'Order created successfully',
        'order': {
            'id': order.id,
            'customer_id': order.customer.id,
            'customer_name': order.customer.name,
            'meal_type': order.meal_type,
            'quantity': order.quantity,
            'total_price': float(order.total_price),
            'status': order.status,
            'created_at': order.created_at.isoformat(),
        }
    }, status=201)
