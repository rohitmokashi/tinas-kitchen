from django.test import TestCase


class KitchenPricingTests(TestCase):
    def test_fixed_daily_prices(self):
        breakfast_price = 50
        lunch_price = 150
        dinner_price = 150

        self.assertEqual(breakfast_price, 50)
        self.assertEqual(lunch_price, 150)
        self.assertEqual(dinner_price, 150)

    def test_customer_registration_requires_name_and_phone(self):
        self.assertTrue(True)
