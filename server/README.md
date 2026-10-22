# Imagify Backend - Django REST Framework (DRF)

This is the Django REST Framework (DRF) backend for the Imagify application, replacing the previous Node.js/Express implementation while retaining full compatibility with the existing React frontend.

The previous Node.js codebase has been safely backed up to `server_node/`.

---

## 🚀 Setup & Run Instructions

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Configure Environment (`.env`)
The `.env` file in this directory contains the following configuration keys:
```env
DJANGO_SECRET_KEY = "your-django-secret-key"
JWT_SECRET = "secret#text"
CLIPDROP_API = "your-clipdrop-api-key"
CURRENCY = "INR"
RAZORPAY_KEY_ID = "your-razorpay-key-id"
RAZORPAY_KEY_SECRET = "your-razorpay-key-secret"
STRIPE_SECRET_KEY = "your-stripe-secret-key"
```

### 3. Run Database Migrations
```bash
python manage.py makemigrations
python manage.py migrate
```

### 4. Create an Admin Superuser (Optional)
```bash
python manage.py createsuperuser
```
You can access the Django admin portal at `http://localhost:4000/admin/` to view and manage users, credit balances, and transaction history.

### 5. Start the Server on Port 4000
The frontend Vite client is configured to connect to `http://localhost:4000`:
```bash
python manage.py runserver 4000
```

### 6. Run Automated Tests
```bash
python manage.py test
```

---

## 📡 API Endpoints

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/` | Health check endpoint (`"API Working"`) | No |
| `POST` | `/api/user/register` | Register new user with 5 initial credits | No |
| `POST` | `/api/user/login` | Login user and issue JWT | No |
| `GET` | `/api/user/credits` | Fetch available credits for logged-in user | Yes (`token` header) |
| `POST` | `/api/image/generate-image` | Generate AI image via ClipDrop API | Yes (`token` header) |
| `POST` | `/api/user/pay-razor` | Create Razorpay order for credits purchase | Yes (`token` header) |
| `POST` | `/api/user/verify-razor` | Verify Razorpay payment and credit user account | No |
| `POST` | `/api/user/pay-stripe` | Create Stripe checkout session | Yes (`token` header) |
| `POST` | `/api/user/verify-stripe` | Verify Stripe payment and credit user account | Yes (`token` header) |
