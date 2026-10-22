from django.test import TestCase
from rest_framework.test import APIClient
from api.models import User, Transaction
from api.authentication import create_jwt_token, hash_password


class ImagifyAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.test_user = User.objects.create(
            name="Test User",
            email="test@example.com",
            password=hash_password("password123"),
            credit_balance=5
        )
        self.valid_token = create_jwt_token(self.test_user.id)

    def test_root_endpoint(self):
        response = self.client.get('/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.content.decode(), "API Working")

    def test_register_user_success(self):
        payload = {
            "name": "New User",
            "email": "newuser@example.com",
            "password": "secretpassword"
        }
        response = self.client.post('/api/user/register', payload, format='json')
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertTrue(data['success'])
        self.assertIn('token', data)
        self.assertEqual(data['user']['name'], "New User")

    def test_register_user_duplicate_email(self):
        payload = {
            "name": "Another User",
            "email": "test@example.com",
            "password": "secretpassword"
        }
        response = self.client.post('/api/user/register', payload, format='json')
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertFalse(data['success'])

    def test_login_user_success(self):
        payload = {
            "email": "test@example.com",
            "password": "password123"
        }
        response = self.client.post('/api/user/login', payload, format='json')
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertTrue(data['success'])
        self.assertIn('token', data)
        self.assertEqual(data['user']['name'], "Test User")

    def test_login_user_invalid_credentials(self):
        payload = {
            "email": "test@example.com",
            "password": "wrongpassword"
        }
        response = self.client.post('/api/user/login', payload, format='json')
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertFalse(data['success'])
        self.assertEqual(data['message'], "Invalid credentials")

    def test_get_user_credits_authorized(self):
        response = self.client.get('/api/user/credits', HTTP_TOKEN=self.valid_token)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertTrue(data['success'])
        self.assertEqual(data['credits'], 5)
        self.assertEqual(data['user']['name'], "Test User")

    def test_get_user_credits_unauthorized(self):
        response = self.client.get('/api/user/credits')
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertFalse(data['success'])
        self.assertEqual(data['message'], "Not Authorized. Login Again")

    def test_generate_image_zero_credits(self):
        self.test_user.credit_balance = 0
        self.test_user.save()
        response = self.client.post(
            '/api/image/generate-image',
            {'prompt': 'A scenic mountain'},
            format='json',
            HTTP_TOKEN=self.valid_token
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertFalse(data['success'])
        self.assertEqual(data['message'], "No Credit Balance")
        self.assertEqual(data['creditBalance'], 0)

    def test_payment_invalid_plan(self):
        response = self.client.post(
            '/api/user/pay-razor',
            {'planId': 'NonExistentPlan'},
            format='json',
            HTTP_TOKEN=self.valid_token
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertFalse(data['success'])
        self.assertEqual(data['message'], 'plan not found')

    def test_stripe_invalid_plan(self):
        response = self.client.post(
            '/api/user/pay-stripe',
            {'planId': 'InvalidPlan'},
            format='json',
            HTTP_TOKEN=self.valid_token
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertFalse(data['success'])
        self.assertEqual(data['message'], 'plan not found')

