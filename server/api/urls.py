from django.urls import re_path
from .views import (
    register_user,
    login_user,
    user_credits,
    payment_razorpay,
    verify_razorpay,
    payment_stripe,
    verify_stripe,
    generate_image,
)

urlpatterns = [
    # User routes
    re_path(r'^user/register/?$', register_user, name='register_user'),
    re_path(r'^user/login/?$', login_user, name='login_user'),
    re_path(r'^user/credits/?$', user_credits, name='user_credits'),
    re_path(r'^user/pay-razor/?$', payment_razorpay, name='payment_razorpay'),
    re_path(r'^user/verify-razor/?$', verify_razorpay, name='verify_razorpay'),
    re_path(r'^user/pay-stripe/?$', payment_stripe, name='payment_stripe'),
    re_path(r'^user/verify-stripe/?$', verify_stripe, name='verify_stripe'),

    # Image routes
    re_path(r'^image/generate-image/?$', generate_image, name='generate_image'),
]
