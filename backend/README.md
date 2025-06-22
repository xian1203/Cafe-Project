# Backend Setup

## 1. Install dependencies
cd backend
npm install

## 2. Configure environment variables
- Copy `.env.example` to `.env`
- Fill in your MongoDB URI and JWT secret

## 3. Start the server
npm run dev

## API Routes
- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/profile (protected, requires Bearer token)
