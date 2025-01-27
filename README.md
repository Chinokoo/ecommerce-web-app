# E-commerce Backend API

This is a Node.js backend API for an e-commerce application. It provides endpoints for user authentication, product management, order management, and payment processing.

## Table of Contents

- Features
- Requirements
- Installation
- Endpoints
- Models
- Middlewares
- Utils
- Environment Variables

## Features

- User authentication and authorization
- Product management (CRUD operations)
- Order management (CRUD operations)
- Payment processing using Stripe
- Coupon management

## Requirements

- Node.js (version 14 or higher)
- MongoDB (version 4 or higher)
- Stripe account for payment processing

## Installation

- Clone the repository: git clone [repository](https://github.com/Chinokoo/ecommerce-web-app)
- Install dependencies: npm install
- Create a .env file and add the following environment

variables:

```
PORT=3001
MONGODB_URI=your mongodb url

REDIS_URL=your redis server url

JWT_SECRET_KEY=your jwt key

REFRESH_SECRET_TOKEN=your token


CLOUDINARY_API_KEY=your cloudinary key

CLOUDINARY_NAME=your cloudinary name

CLOUDINARY_API_SECRET=cloudinary secret

STRIPE_SECRET_KEY=your stripe secret key
STRIPE_PUBLISHAPLE_KEY=your stripe publishable key

CLIENT_URL=client url

```

- Start the server: npm run dev

## Endpoints

### Authentication

- POST /api/auth/signup: create a new user
- POST /api/auth/signin: login a user
- GET /api/auth/user: get the current user

### Products

- GET /api/products: get all products
- GET /api/products/:id: get a product by ID
- POST /api/products: create a new product
- PUT /api/products/:id: update a product
- DELETE /api/products/:id: delete a product

### Orders

- GET /api/orders: get all orders
- GET /api/orders/:id: get an order by ID
- POST /api/orders: create a new order
- PUT /api/orders/:id: update an order
- DELETE /api/orders/:id: delete an order

### Payments

- POST /api/payments/create-checkout-session: create a new checkout session
- POST /api/payments/checkout-success: handle checkout success

### Coupons

- GET /api/coupons: get all coupons
- GET /api/coupons/:id: get a coupon by ID
- POST /api/coupons: create a new coupon
- PUT /api/coupons/:id: update a coupon
- DELETE /api/coupons/:id: delete a coupon

### Models

- User: represents a user
- Product: represents a product
- Order: represents an order
- Coupon: represents a coupon

### Middlewares

- auth: authentication middleware
- admin: admin-only middleware

### Utils

- stripe: Stripe utility functions
- cloudinary: Cloudinary utility functions
- redis: Redis utility functions

### Environment Variables

- MONGODB_URI: MongoDB connection string
- STRIPE_SECRET_KEY: Stripe secret key
- CLIENT_URL: client-side application URL
- NODE_ENV: Node.js environment (development or production)
- cloudinary secrets
