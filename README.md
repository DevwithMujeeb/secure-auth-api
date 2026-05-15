# 🔐 Secure Auth API

A production-grade authentication and authorization REST API built with Node.js, Express, and MongoDB. Designed as a security lab/demo project showcasing real-world auth engineering patterns.

![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.x-000000?style=flat&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-Auth-000000?style=flat&logo=jsonwebtokens&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue.svg)

---

## ✨ Features

- **JWT Authentication** — Access tokens (15min) + Refresh tokens (7 days) with automatic rotation
- **Role-Based Access Control (RBAC)** — `user`, `moderator`, and `admin` roles with protected routes
- **Brute Force Protection** — Account lockout after 5 failed login attempts (15 min cooldown)
- **Rate Limiting** — IP-based rate limiting on all auth endpoints (5 req/15min on login)
- **Password Reset Flow** — Secure token-based reset via email with 15-minute expiry
- **Refresh Token Rotation** — Every refresh issues a new token pair, old tokens invalidated
- **Security Headers** — Helmet.js for HTTP security headers out of the box
- **httpOnly Cookies** — Refresh tokens stored in httpOnly cookies, never exposed to JS

---

## 🛠️ Tech Stack

| Layer            | Technology                 |
| ---------------- | -------------------------- |
| Runtime          | Node.js                    |
| Framework        | Express.js                 |
| Database         | MongoDB + Mongoose         |
| Authentication   | JSON Web Tokens (JWT)      |
| Password Hashing | bcryptjs (12 rounds)       |
| Email            | Nodemailer + Gmail SMTP    |
| Security         | Helmet, express-rate-limit |
| Dev Tools        | Nodemon, dotenv            |

---

## 📁 Project Structure

```
secure-auth-api/
├── src/
│   ├── config/
│   │   └── db.js               # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js   # Auth logic (register, login, refresh, reset)
│   │   └── adminController.js  # Admin logic (users, roles, dashboard)
│   ├── middleware/
│   │   ├── authMiddleware.js   # JWT protect + RBAC authorize
│   │   └── rateLimiter.js      # Rate limiting strategies
│   ├── models/
│   │   └── User.js             # User schema with security fields
│   ├── routes/
│   │   ├── authRoutes.js       # /api/auth/* routes
│   │   └── adminRoutes.js      # /api/admin/* routes
│   ├── utils/
│   │   ├── tokenHelper.js      # JWT generate/verify helpers
│   │   ├── emailService.js     # Nodemailer email sender
│   │   └── logger.js           # Timestamped console logger
│   ├── app.js                  # Express app setup
│   └── server.js               # Entry point
├── .env.example
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or [Atlas](https://cloud.mongodb.com) free tier)
- Gmail account with App Password enabled

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/DevwithMujeeb/secure-auth-api.git
cd secure-auth-api

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env with your values

# 4. Start the development server
npm run dev
```

### Environment Variables

Create a `.env` file based on `.env.example`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_ACCESS_SECRET=your_super_secret_access_key
JWT_REFRESH_SECRET=your_super_secret_refresh_key
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d
CLIENT_URL=http://localhost:3000
EMAIL_USER=yourgmail@gmail.com
EMAIL_PASS=your_gmail_app_password
EMAIL_FROM=Secure Auth API <yourgmail@gmail.com>
```

> ⚠️ Never commit your `.env` file. It's already in `.gitignore`.

---

## 📡 API Reference

### Auth Routes — `/api/auth`

| Method | Endpoint           | Description                  | Auth Required |
| ------ | ------------------ | ---------------------------- | ------------- |
| `POST` | `/register`        | Register a new user          | ❌            |
| `POST` | `/login`           | Login and receive tokens     | ❌            |
| `POST` | `/logout`          | Logout and clear tokens      | ❌            |
| `POST` | `/refresh`         | Rotate refresh token         | 🍪 Cookie     |
| `GET`  | `/me`              | Get current user profile     | ✅ Bearer     |
| `POST` | `/forgot-password` | Request password reset email | ❌            |
| `POST` | `/reset-password`  | Reset password with token    | ❌            |

### Admin Routes — `/api/admin`

| Method  | Endpoint          | Description      | Role Required        |
| ------- | ----------------- | ---------------- | -------------------- |
| `GET`   | `/dashboard`      | Get user stats   | `admin`, `moderator` |
| `GET`   | `/users`          | Get all users    | `admin`              |
| `PATCH` | `/users/:id/role` | Update user role | `admin`              |

---

## 🔒 Security Design Decisions

**Why httpOnly cookies for refresh tokens?**
Storing refresh tokens in httpOnly cookies prevents JavaScript access, eliminating XSS-based token theft. Access tokens are short-lived (15min) to minimize exposure.

**Why token rotation on every refresh?**
Each refresh request invalidates the previous refresh token and issues a new one. If a token is stolen and used, the legitimate user's next refresh will fail — alerting the system to potential token reuse.

**Why hash the password reset token?**
The raw token is emailed to the user. Only a SHA-256 hash is stored in the DB. Even if the database is compromised, attackers can't use the hashed token directly.

**Why always return 200 on forgot-password?**
Returning an error when an email doesn't exist leaks user data (email enumeration attack). We always return the same message regardless.

**Why bcrypt with 12 rounds?**
12 rounds provides strong resistance to brute-force attacks while remaining practical. Each hash takes ~300ms — slow enough for attackers, fast enough for users.

---

## 🧪 Testing the API

Import the Postman collection or test manually:

```bash
# Health check
GET http://localhost:5000/health

# Register
POST http://localhost:5000/api/auth/register
{"username": "john", "email": "john@example.com", "password": "SecurePass123"}

# Login
POST http://localhost:5000/api/auth/login
{"email": "john@example.com", "password": "SecurePass123"}

# Access protected route
GET http://localhost:5000/api/auth/me
Authorization: Bearer <access_token>

# Refresh token
POST http://localhost:5000/api/auth/refresh
# (refreshToken cookie sent automatically)
```

---

## 🗺️ Roadmap

- [ ] Email verification on registration
- [ ] OAuth 2.0 (Google, GitHub)
- [ ] Two-factor authentication (2FA)
- [ ] Audit log for security events
- [ ] Docker support
- [ ] Unit and integration tests

---

## 👨‍💻 Author

**Abdulmujeeb Uthman**

- GitHub: [@DevwithMujeeb](https://github.com/DevwithMujeeb)
- LinkedIn: [linkedin.com/in/abdulmujeeb-uthman](https://linkedin.com/in/abdulmujeeb-uthman)

---

## 📄 License

This project is licensed under the MIT License.
