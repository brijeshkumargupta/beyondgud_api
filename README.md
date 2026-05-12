# Beyond Gud Backend API

REST API for the Beyond Gud ecommerce platform built with **Node.js**, **Express**, **MongoDB** and documented with **Swagger UI**.

## 🚀 Quick Start

### Prerequisites
- Node.js installed
- MongoDB running locally (`C:\data\db`)

### 1. Start MongoDB
Double-click `start-mongo.bat` or run:
```bash
"C:\Program Files\MongoDB\Server\8.3\bin\mongod.exe" --dbpath C:\data\db
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start the Server
```bash
npm start
```

The server will start on **http://localhost:5000**

### 4. View Swagger API Docs
Open **http://localhost:5000/api-docs** in your browser.

---

## 📁 Project Structure

```
BeyondGudBackend/
├── config/
│   └── db.js               # MongoDB connection
├── controllers/
│   ├── authController.js   # Register, Login, Profile
│   ├── categoryController.js
│   ├── productController.js
│   ├── cartController.js
│   └── wishlistController.js
├── middleware/
│   └── authMiddleware.js   # JWT token verification
├── models/
│   ├── User.js
│   ├── Product.js
│   ├── Category.js
│   └── Cart.js
├── routes/
│   ├── authRoutes.js
│   ├── categoryRoutes.js
│   ├── productRoutes.js
│   ├── cartRoutes.js
│   └── wishlistRoutes.js
├── utils/
│   └── generateToken.js    # JWT token generator
├── .env                    # Environment variables
├── server.js               # Main app entry point
└── start-mongo.bat         # MongoDB startup script
```

---

## 📋 API Endpoints

### 🔐 Auth (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login & get JWT token | No |
| GET | `/api/auth/profile` | Get user profile + wishlist | ✅ Yes |

### 📦 Products (`/api/products`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/products` | Get all products | No |
| GET | `/api/products/:id` | Get product by ID | No |
| POST | `/api/products` | Create a product | No |

### 🗂️ Categories (`/api/categories`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/categories` | Get all categories | No |
| POST | `/api/categories` | Create a category | No |

### 🛒 Cart (`/api/cart`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/cart` | Get user's cart | ✅ Yes |
| POST | `/api/cart` | Add item to cart | ✅ Yes |

### ❤️ Wishlist (`/api/wishlist`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/wishlist` | Get user's wishlist | ✅ Yes |
| POST | `/api/wishlist` | Add/remove item | ✅ Yes |

---

## 🔑 Authentication

Protected routes require a **Bearer Token** in the header:
```
Authorization: Bearer <your_jwt_token>
```

Get your token by calling `POST /api/auth/login`.

---

## ⚙️ Environment Variables (`.env`)

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/beyondgud
JWT_SECRET=supersecretjwtkeyforbeyondgud
```
