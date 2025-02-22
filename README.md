# News Subscription API with Premium Content

A RESTful API for news subscriptions with premium content access, built with Node.js, Express, MongoDB, and Stripe integration.

## 🚀 Live Demo
API Base URL: [https://subscriptions-with-payment.vercel.app/](https://subscriptions-with-payment.vercel.app/)

## 🛠️ Tech Stack
- Node.js & Express
- MongoDB
- JWT Authentication
- Stripe Payment Integration
- Nodemailer (Gmail SMTP)
- News API Integration

## 📦 Setup & Installation

1. Clone the repository
```bash
git clone https://github.com/mihf05/subscriptions-with-payment.git
cd subscriptions-with-payment
```

2. Install dependencies
```bash
npm install
```

3. Environment Variables
Create a `.env` file with:
```env
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
NEWS_API_KEY=your_news_api_key
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email
SMTP_PASS=your_email_password
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
```

4. Start the server
```bash
npm run dev
```

## 📚 API Documentation

### Base URL
```
https://subscriptions-with-payment.vercel.app
```

### Authentication Endpoints

#### 1. Register User
```http
POST /api/auth/register
Content-Type: application/json

Body:
{
    "name": "Irfan hasan",
    "email": "irfan@abc.com",
    "password": "123456"
}

Response:
{
    "_id": "user_id",
    "name": "Irfan hasan",
    "email": "irfan@abc.com",
    "token": "jwt_token"
}
```

#### 2. Login
```http
POST /api/auth/login
Content-Type: application/json

Body:
{
    "email": "irfan@abc.com",
    "password": "123456"
}

Response:
{
    "_id": "user_id",
    "name": "Irfan hasan",
    "email": "irfan@abc.com",
    "token": "jwt_token"
}
```

#### 3. Logout
```http
POST /api/auth/logout
Content-Type: application/json
Authorization: Bearer <token>

Response:
{
    "message": "Logged out successfully"
}
```

### Subscription Management

#### 1. Subscribe to Category
```http
POST /api/subscriptions/subscribe
Content-Type: application/json
Authorization: Bearer <token>

Body:
{
    "category": "Business"
}

Response:
{
    "message": "Subscription successful",
    "subscriptions": ["Business"],
    "emailStatus": "sent"
}
```

#### 2. Unsubscribe from Category
```http
POST /api/subscriptions/unsubscribe
Content-Type: application/json
Authorization: Bearer <token>

Body:
{
    "category": "Business"
}

Response:
{
    "message": "Unsubscription successful",
    "subscriptions": [],
    "emailStatus": "sent"
}
```

#### 3. List Subscriptions
```http
GET /api/subscriptions/list
Authorization: Bearer <token>

Response:
{
    "subscriptions": ["Tech", "Business", "Health"]
}
```

### Content Management

#### 1. Get Content Feed
```http
GET /api/content/feed
Authorization: Bearer <token>

Response:
{
    "subscriptions": ["Tech", "Business"],
    "feed": {
        "Tech": [...articles],
        "Business": [...articles]
    }
}
```

#### 2. Get Premium Content
```http
GET /api/content/premium
Authorization: Bearer <token>

Response:
{
    "isPremium": true,
    "premiumUntil": "2024-03-20T10:30:00.000Z",
    "feed": {
        "Tech": {
            "articles": [...],
            "premiumFeatures": {...}
        }
    }
}
```

### Payment Management

#### 1. Get Available Plans
```http
GET /api/payments/plans
Authorization: Bearer <token>

Response:
{
    "message": "Available premium plans",
    "plans": [
        {
            "type": "monthly",
            "amount": 9.99,
            "description": "1 month premium access"
        },
        {
            "type": "yearly",
            "amount": 99.99,
            "description": "1 year premium access"
        }
    ]
}
```

#### 2. Create Payment Link
```http
POST /api/payments/create-link
Content-Type: application/json
Authorization: Bearer <token>

Body:
{
    "type": "yearly"
}

Response:
{
    "message": "Payment link created",
    "url": "https://checkout.stripe.com/...",
    "sessionId": "cs_test_..."
}
```

#### 3. Payment Confirmation
```http
GET /api/payments/success?session_id=cs_test_...
Authorization: Bearer <token>

Response:
{
    "message": "Premium access activated successfully",
    "success": true,
    "paymentId": "payment_id",
    "premiumUntil": "2024-03-20T10:30:00.000Z"
}
```

### Headers for All Protected Routes
```http
Content-Type: application/json
Authorization: Bearer <jwt_token>
```

## 💳 Test Payment Details
```
Card: 4242 4242 4242 4242
Expiry: Any future date
CVC: Any 3 digits
ZIP: Any 5 digits
```

## 🔒 Premium Features
- Ad-free experience
- Detailed content analysis
- Expert insights
- Download options (PDF, Excel)
- Related topics
- Market impact assessment

## 📧 Email Notifications
- Subscription confirmation
- Payment confirmation
- Premium access activation
- Weekly news digest

## 🚀 Deployment
The API is deployed on Vercel. Configuration is in `vercel.json`.


## 🤝 Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## ⚠️ Important Notes
- Use environment variables for sensitive data
- Test thoroughly before deployment
- Keep dependencies updated
- Monitor API usage limits