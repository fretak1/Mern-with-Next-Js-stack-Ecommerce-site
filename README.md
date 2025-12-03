                                                               EthioMarket

EthioMarket is a fullstack e-commerce web application designed to provide a seamless online shopping experience. Users can browse products, manage carts, place orders, and securely handle payments.  Admins can manage products, banners, coupons, and orders efficiently.

# Tech Stack

•	Frontend:  React, Next.js, Tailwind CSS, Framer Motion

•	Backend:  Node.js, Express.js, Prisma ORM

•	Database: PostgreSQL

•	File Storage / Media:  Cloudinary

•	Authentication:  JWT (Access & Refresh Tokens)

•	Payment Gateway:  Chapa

•	Other:  Multer for file uploads, bcrypt for password hashing, cookie-parser, CORS

# Features

User Features

•	User registration and login with secure authentication
•	Password reset via email verification code
•	Browse and filter products by category, brand, color, size, and price
•	Product search functionality
•	Add products to cart and manage cart items
•	Checkout and order placement
•	View order history and status
•	Subscribe to newsletter

Admin Features

•	Manage products (add, edit, delete)
•	Upload feature banners
•	Create and manage coupons
•	View all orders and update their status

Security

•	Password hashing with bcrypt
•	Cookie-based session management with HTTP-only cookies

# Installation & Setup

# 1, Clone the repository:

git clone [https://github.com/<your-username>/ethiomarket.git](https://github.com/fretak1/Mern-with-Next-Js-stack-Ecommerce-site.git)
cd ethiomarket

# 2, Install dependencies:

Backend
cd server
npm install

Frontend
cd ../client
npm install

# 3, Set up environment variables (.env):

DATABASE_URL=postgresql://username:password@localhost:5432/ethiomarket
JWT_SECRET=your_jwt_secret
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLIENT_URL=http://localhost:3000

# 4, Run the backend server:

cd server
npm run dev

# 5, Run the frontend:

cd client
npm run dev

# Usage

Access the frontend at http://localhost:3000
Register as a new user or login
Browse products, add to cart, and checkout
Admins can log in to access management features

# Access Live Demo Here

https://mern-with-next-js-stack-ecommerce-s.vercel.app


