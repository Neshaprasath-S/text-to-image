import time
import base64
import requests
import razorpay
import stripe
from django.conf import settings
from django.http import HttpResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from .models import User, Transaction
from .authentication import (
    hash_password,
    check_password_hash,
    create_jwt_token,
    auth_user,
)


@api_view(['GET'])
@permission_classes([AllowAny])
def root_view(request):
    """Health check endpoint matching Node.js server."""
    return HttpResponse("API Working")


# ==============================================================================
# User Authentication & Credits
# ==============================================================================

@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    """API to register user."""
    try:
        name = request.data.get('name')
        email = request.data.get('email')
        password = request.data.get('password')

        # Checking for all data to register user
        if not name or not email or not password:
            return Response({'success': False, 'message': 'Missing Details'})

        # Check if user already exists
        if User.objects.filter(email=email).exists():
            return Response({'success': False, 'message': 'User already exists with this email'})

        # Hashing user password
        hashed_password = hash_password(password)

        # Create user with initial 5 credits
        user = User.objects.create(
            name=name,
            email=email,
            password=hashed_password,
            credit_balance=5,
        )

        token = create_jwt_token(user.id)
        return Response({'success': True, 'token': token, 'user': {'name': user.name}})

    except Exception as error:
        return Response({'success': False, 'message': str(error)})


@api_view(['POST'])
@permission_classes([AllowAny])
def login_user(request):
    """API to login user."""
    try:
        email = request.data.get('email')
        password = request.data.get('password')

        if not email or not password:
            return Response({'success': False, 'message': 'Missing Details'})

        user = User.objects.filter(email=email).first()
        if not user:
            return Response({'success': False, 'message': 'User does not exist'})

        is_match = check_password_hash(password, user.password)

        if is_match:
            token = create_jwt_token(user.id)
            return Response({'success': True, 'token': token, 'user': {'name': user.name}})
        else:
            return Response({'success': False, 'message': 'Invalid credentials'})

    except Exception as error:
        return Response({'success': False, 'message': str(error)})


@api_view(['GET'])
@auth_user
def user_credits(request):
    """API Controller function to get user available credits data."""
    try:
        user = request.authenticated_user
        return Response({
            'success': True,
            'credits': user.credit_balance,
            'user': {'name': user.name},
        })
    except Exception as error:
        return Response({'success': False, 'message': str(error)})


# ==============================================================================
# Image Generation
# ==============================================================================

@api_view(['POST'])
@auth_user
def generate_image(request):
    """Controller function to generate image from prompt via ClipDrop API."""
    try:
        user = request.authenticated_user
        prompt = request.data.get('prompt')

        if not prompt:
            return Response({'success': False, 'message': 'Missing Details'})

        # Checking User creditBalance
        if user.credit_balance <= 0:
            return Response({
                'success': False,
                'message': 'No Credit Balance',
                'creditBalance': user.credit_balance,
            })

        # Calling ClipDrop Text-to-Image API
        files = {
            'prompt': (None, prompt, 'text/plain'),
        }

        # [API KEY LOCATION]:
        # The ClipDrop API key is retrieved from django.conf.settings.CLIPDROP_API
        # (originally configured in server/.env -> loaded into server/settings.py).
        # ClipDrop requires this key in the 'x-api-key' request header.
        headers = {
            'x-api-key': settings.CLIPDROP_API,
        }

        api_response = requests.post(
            'https://clipdrop-api.co/text-to-image/v1',
            files=files,
            headers=headers,
            timeout=120,
        )

        if api_response.status_code != 200:
            try:
                err_data = api_response.json()
                msg = err_data.get('error', f'ClipDrop Error: {api_response.status_code}')
            except Exception:
                msg = api_response.text or f'ClipDrop Error: {api_response.status_code}'
            return Response({'success': False, 'message': msg})

        # Conversion of response binary to base64
        base64_image = base64.b64encode(api_response.content).decode('utf-8')
        result_image = f"data:image/png;base64,{base64_image}"

        # Deduction of user credit
        user.credit_balance -= 1
        user.save()

        # Sending Response (exact format expected by frontend)
        return Response({
            'success': True,
            'message': 'Background Removed',
            'resultImage': result_image,
            'creditBalance': user.credit_balance,
        })

    except Exception as error:
        return Response({'success': False, 'message': str(error)})


# ==============================================================================
# Razorpay Payment Integration
# ==============================================================================

PLANS = {
    'Basic': {'credits': 100, 'amount': 10},
    'Advanced': {'credits': 500, 'amount': 50},
    'Business': {'credits': 5000, 'amount': 250},
}


@api_view(['POST'])
@auth_user
def payment_razorpay(request):
    """Payment API to create Razorpay order for adding credits."""
    try:
        user = request.authenticated_user
        plan_id = request.data.get('planId')

        if not plan_id or plan_id not in PLANS:
            return Response({'success': False, 'message': 'plan not found'})

        plan_info = PLANS[plan_id]
        credits = plan_info['credits']
        amount = plan_info['amount']
        date_timestamp = int(time.time() * 1000)

        # Creating Transaction Data
        new_transaction = Transaction.objects.create(
            user=user,
            plan=plan_id,
            amount=amount,
            credits=credits,
            date=date_timestamp,
        )

        # Initialize Razorpay Client
        razorpay_client = razorpay.Client(
            auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET)
        )

        # Creating options to create razorpay Order
        options = {
            'amount': int(amount * 100),
            'currency': settings.CURRENCY,
            'receipt': str(new_transaction.id),
        }

        order = razorpay_client.order.create(data=options)
        return Response({'success': True, 'order': order})

    except Exception as error:
        return Response({'success': False, 'message': str(error)})


@api_view(['POST'])
@permission_classes([AllowAny])
def verify_razorpay(request):
    """API Controller function to verify razorpay payment."""
    try:
        razorpay_order_id = request.data.get('razorpay_order_id')
        if not razorpay_order_id:
            return Response({'success': False, 'message': 'Missing razorpay_order_id'})

        razorpay_client = razorpay.Client(
            auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET)
        )

        order_info = razorpay_client.order.fetch(razorpay_order_id)

        if order_info.get('status') == 'paid':
            receipt_id = order_info.get('receipt')
            transaction = Transaction.objects.filter(id=receipt_id).first()

            if not transaction:
                return Response({'success': False, 'message': 'Transaction not found'})

            if transaction.payment:
                return Response({'success': False, 'message': 'Payment Failed'})

            # Adding Credits to user
            user = transaction.user
            user.credit_balance += transaction.credits
            user.save()

            # Marking payment as true
            transaction.payment = True
            transaction.save()

            return Response({'success': True, 'message': 'Credits Added'})
        else:
            return Response({'success': False, 'message': 'Payment Failed'})

    except Exception as error:
        return Response({'success': False, 'message': str(error)})


# ==============================================================================
# Stripe Payment Integration
# ==============================================================================

@api_view(['POST'])
@auth_user
def payment_stripe(request):
    """Payment API to create Stripe checkout session for credits purchase."""
    try:
        user = request.authenticated_user
        plan_id = request.data.get('planId')
        origin = request.headers.get('origin') or request.META.get('HTTP_ORIGIN', 'http://localhost:5173')

        if not plan_id or plan_id not in PLANS:
            return Response({'success': False, 'message': 'plan not found'})

        plan_info = PLANS[plan_id]
        credits = plan_info['credits']
        amount = plan_info['amount']
        date_timestamp = int(time.time() * 1000)

        # Creating Transaction Data
        new_transaction = Transaction.objects.create(
            user=user,
            plan=plan_id,
            amount=amount,
            credits=credits,
            date=date_timestamp,
        )

        stripe.api_key = settings.STRIPE_SECRET_KEY
        currency = settings.CURRENCY.lower()

        line_items = [{
            'price_data': {
                'currency': currency,
                'product_data': {
                    'name': 'Credit Purchase',
                },
                'unit_amount': int(amount * 100),
            },
            'quantity': 1,
        }]

        session = stripe.checkout.Session.create(
            success_url=f"{origin}/verify?success=true&transactionId={new_transaction.id}",
            cancel_url=f"{origin}/verify?success=false&transactionId={new_transaction.id}",
            line_items=line_items,
            mode='payment',
        )

        return Response({'success': True, 'session_url': session.url})

    except Exception as error:
        return Response({'success': False, 'message': str(error)})


@api_view(['POST'])
@auth_user
def verify_stripe(request):
    """API Controller function to verify stripe payment."""
    try:
        transaction_id = request.data.get('transactionId')
        success = str(request.data.get('success', '')).lower()

        if success == 'true':
            transaction = Transaction.objects.filter(id=transaction_id).first()

            if not transaction:
                return Response({'success': False, 'message': 'Transaction not found'})

            if transaction.payment:
                return Response({'success': False, 'message': 'Payment Already Verified'})

            # Adding Credits to user
            user = transaction.user
            user.credit_balance += transaction.credits
            user.save()

            # Marking payment as true
            transaction.payment = True
            transaction.save()

            return Response({'success': True, 'message': 'Credits Added'})
        else:
            return Response({'success': False, 'message': 'Payment Failed'})

    except Exception as error:
        return Response({'success': False, 'message': str(error)})
