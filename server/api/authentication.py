import jwt
import bcrypt
from functools import wraps
from django.conf import settings
from rest_framework.response import Response
from .models import User


def hash_password(password: str) -> str:
    """Hashes a plain password using bcrypt (matching Node.js bcrypt implementation)."""
    salt = bcrypt.gensalt(10)
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')


def check_password_hash(password: str, hashed_password: str) -> bool:
    """Verifies a plain password against the hashed password."""
    try:
        return bcrypt.checkpw(password.encode('utf-8'), hashed_password.encode('utf-8'))
    except Exception:
        return False


def create_jwt_token(user_id: int) -> str:
    """Creates a JWT token containing user id signed with JWT_SECRET."""
    payload = {'id': user_id}
    return jwt.encode(payload, settings.JWT_SECRET, algorithm='HS256')


def get_token_from_request(request) -> str:
    """Extracts token from custom header 'token' or standard 'Authorization: Bearer <token>'."""
    token = request.headers.get('token')
    if not token:
        token = request.META.get('HTTP_TOKEN')
    if not token:
        auth_header = request.headers.get('authorization') or request.META.get('HTTP_AUTHORIZATION')
        if auth_header and auth_header.startswith('Bearer '):
            token = auth_header.split(' ', 1)[1]
    return token


def auth_user(view_func):
    """
    Decorator for views that require user authentication.
    Validates token from request headers and attaches authenticated_user and user_id to request.
    Returns { success: False, message: 'Not Authorized. Login Again' } on failure.
    """
    @wraps(view_func)
    def _wrapped_view(request, *args, **kwargs):
        token = get_token_from_request(request)
        if not token:
            return Response({'success': False, 'message': 'Not Authorized. Login Again'})

        try:
            payload = jwt.decode(token, settings.JWT_SECRET, algorithms=['HS256'])
            user_id = payload.get('id')
            if not user_id:
                return Response({'success': False, 'message': 'Not Authorized. Login Again'})

            user = User.objects.filter(id=user_id).first()
            if not user:
                return Response({'success': False, 'message': 'User does not exist'})

            request.authenticated_user = user
            request.user_id = user.id
            return view_func(request, *args, **kwargs)

        except jwt.ExpiredSignatureError:
            return Response({'success': False, 'message': 'Token expired. Login Again'})
        except jwt.PyJWTError as e:
            return Response({'success': False, 'message': 'Not Authorized. Login Again'})
        except Exception as e:
            return Response({'success': False, 'message': str(e)})

    return _wrapped_view
