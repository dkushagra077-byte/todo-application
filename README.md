# Production-Ready Full-Stack Todo Application

A full-stack, secure, multi-tenant Todo application built with **React.js**, **Node.js**, **Express.js**, and **Supabase PostgreSQL**. The system employs a strict **MVC (Model-View-Controller)** backend architecture, JWT-based authentication, bcrypt password hashing, and database-level **Row Level Security (RLS)**.

---

## 1. Project Overview

This project provides a robust, decoupled, full-stack task management solution:
* **Frontend:** Single Page Application (SPA) built with pure React.js and vanilla CSS design system.
* **Backend:** REST API server built with Node.js and Express.js implementing MVC architecture.
* **Database:** Managed Supabase PostgreSQL with UUID keys, foreign key constraints, and Row Level Security.
* **Security:** Service-role credentials never reach the browser; passwords are encrypted with bcrypt; API requests are verified via JWT Bearer tokens; database queries are strictly scoped per authenticated user.

---

## 2. Technologies Used

### Frontend (`frontend-todo`)
* **React 18**: UI component library
* **React Router v6**: Client-side declarative routing and protected routes
* **Axios**: HTTP client with request and response interceptors
* **Webpack 5 & Babel**: Modern bundling, ES6+ transpilation, and hot-reload dev server
* **Vanilla CSS**: Custom CSS tokens, responsive layout, animations, and zero framework overhead

### Backend (`backend-todo`)
* **Node.js**: Runtime environment
* **Express.js**: RESTful Web Framework
* **@supabase/supabase-js**: PostgreSQL data access client
* **bcryptjs**: Salted password hashing (10 salt rounds)
* **jsonwebtoken (JWT)**: Stateless token issuance and verification
* **cors**: Configurable Cross-Origin Resource Sharing
* **dotenv**: Environment variable management
* **nodemon**: Development server with hot reload

### Database (`Supabase PostgreSQL`)
* **PostgreSQL 17.6**
* **Row Level Security (RLS)** enabled on all user-owned tables
* **Triggers** for automated `updated_at` timestamps

---

## 3. Architecture

```text
                                  TODO FULL STACK APP
                                           │
                     ┌─────────────────────┴─────────────────────┐
                     │                                           │
                     ▼                                           ▼
              frontend-todo                                backend-todo
                (React.js)                              (Node.js + Express)
                     │                                           │
                     │ REST API (JSON / Bearer JWT)             │
                     └─────────────────────┬─────────────────────┘
                                           ▼
                                    MVC Architecture
                                           │
                            ┌──────────────┴──────────────┐
                            │                             │
                       Controllers                     Services
                      (HTTP req/res)             (Business Logic/Bcrypt/JWT)
                            │                             │
                            └──────────────┬──────────────┘
                                           ▼
                                         Models
                                 (Database abstraction)
                                           │
                                           ▼
                                 Supabase Client (SDK)
                                           │
                                           ▼
                                 Supabase PostgreSQL
                                           │
                                ┌──────────┴──────────┐
                                │                     │
                              users                 todos
                                │                     │
                               RLS                   RLS
```

### Complete Separation of Concerns
1. The **React Frontend** NEVER communicates directly with Supabase.
2. The `SUPABASE_SERVICE_ROLE_KEY` is NEVER exposed to the frontend or browser bundle.
3. All database interactions pass through the backend **MVC** layers:
   - **Routes**: Route definition, HTTP method handling, middleware binding.
   - **Middleware**: Authentication verification (`authMiddleware`), request validation (`validateMiddleware`), and centralized error handling (`errorMiddleware`).
   - **Controllers**: Parsing inputs, invoking services, formatting standard API responses.
   - **Services**: Business rules, password hashing with bcrypt, JWT token generation.
   - **Models**: Database queries strictly scoped to the authenticated `user_id`.

---

## 4. Folder Structure

```text
todo-fullstack/
│
├── frontend-todo/
│   ├── public/
│   │   └── index.html               # HTML5 template with Inter font
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js            # Top navigation bar with auth status & logout
│   │   │   ├── ProtectedRoute.js    # Route guard redirecting unauthorized users to /login
│   │   │   ├── TodoForm.js          # Task creation form with validation
│   │   │   ├── TodoList.js          # Task list with search bar & filter tabs
│   │   │   ├── TodoItem.js          # Single task item with inline editing & toggle
│   │   │   ├── Loading.js           # Animated spinner & full-page loader
│   │   │   └── ErrorMessage.js      # Dismissible alert banner
│   │   ├── pages/
│   │   │   ├── LoginPage.js         # User login page
│   │   │   ├── RegisterPage.js      # User registration page
│   │   │   └── TodosPage.js         # Main todo dashboard with stats & progress
│   │   ├── services/
│   │   │   ├── api.js               # Axios instance with Bearer token interceptor
│   │   │   ├── authService.js       # Register, login, me, logout API calls
│   │   │   └── todoService.js       # Todo CRUD API calls
│   │   ├── context/
│   │   │   └── AuthContext.js       # Global auth state & persistent token management
│   │   ├── hooks/
│   │   │   ├── useAuth.js           # Auth context consumer hook
│   │   │   └── useTodos.js          # Todo state, filters, and optimistic updates
│   │   ├── utils/
│   │   │   └── token.js             # LocalStorage token helper
│   │   ├── App.js                   # Client routing configuration
│   │   ├── App.css                  # Component styling & layout
│   │   ├── index.js                 # React DOM root entry
│   │   └── index.css                # CSS variables, design tokens & reset
│   ├── .env                         # Frontend local environment config
│   ├── .env.example                 # Example frontend environment variables
│   ├── .gitignore                   # Frontend gitignore rules
│   ├── package.json                 # Frontend dependencies and scripts
│   └── webpack.config.js            # Webpack 5 configuration with hot reload
│
├── backend-todo/
│   ├── src/
│   │   ├── config/
│   │   │   └── supabase.js          # Supabase client initialization
│   │   ├── controllers/
│   │   │   ├── authController.js    # Auth HTTP controller
│   │   │   └── todoController.js    # Todo CRUD HTTP controller
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js    # JWT verification & req.user attachment
│   │   │   ├── errorMiddleware.js   # Centralized error handler & 404 handler
│   │   │   └── validateMiddleware.js# Input validation rules
│   │   ├── models/
│   │   │   ├── userModel.js         # Database model for `users`
│   │   │   └── todoModel.js         # Database model for `todos`
│   │   ├── routes/
│   │   │   ├── authRoutes.js        # /api/auth routes
│   │   │   └── todoRoutes.js        # /api/todos routes
│   │   ├── services/
│   │   │   ├── authService.js       # Auth business logic, bcrypt & JWT
│   │   │   └── todoService.js       # Todo business logic & authorization
│   │   ├── utils/
│   │   │   ├── responseHandler.js   # Standard success/error response helpers
│   │   │   └── jwt.js               # JWT signing & verification helper
│   │   ├── app.js                   # Express application setup & middleware
│   │   └── server.js                # Server entry point with graceful shutdown
│   ├── .env                         # Backend environment variables
│   ├── .env.example                 # Backend environment variable template
│   ├── .gitignore                   # Backend gitignore rules
│   └── package.json                 # Backend dependencies and scripts
│
├── README.md                        # Complete project documentation
└── .gitignore                       # Root gitignore rules
```

---

## 5. Supabase Setup & Database Schema

The database is hosted on Supabase PostgreSQL (Project ID: `bstgxboyjpsdwxyzixlx`).

### `users` Table Schema
```sql
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
```

### `todos` Table Schema
```sql
CREATE TABLE IF NOT EXISTS todos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_todos_user_id ON todos(user_id);
```

### Trigger for `updated_at`
```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_todos_updated_at
    BEFORE UPDATE ON todos
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

---

## 6. Row Level Security (RLS) Policies

Row Level Security is enabled on all tables:
```sql
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;
```

### `todos` Table Policies
1. **Read Own Todos (SELECT)**
   ```sql
   CREATE POLICY "Users can read own todos" ON todos
       FOR SELECT
       USING (auth.uid() = user_id);
   ```
2. **Create Own Todos (INSERT)**
   ```sql
   CREATE POLICY "Users can insert own todos" ON todos
       FOR INSERT
       WITH CHECK (auth.uid() = user_id);
   ```
3. **Update Own Todos (UPDATE)**
   ```sql
   CREATE POLICY "Users can update own todos" ON todos
       FOR UPDATE
       USING (auth.uid() = user_id)
       WITH CHECK (auth.uid() = user_id);
   ```
4. **Delete Own Todos (DELETE)**
   ```sql
   CREATE POLICY "Users can delete own todos" ON todos
       FOR DELETE
       USING (auth.uid() = user_id);
   ```

### `users` Table Policies
1. **Read Own Profile (SELECT)**
   ```sql
   CREATE POLICY "Users can read own profile" ON users
       FOR SELECT
       USING (auth.uid() = id);
   ```
2. **Update Own Profile (UPDATE)**
   ```sql
   CREATE POLICY "Users can update own profile" ON users
       FOR UPDATE
       USING (auth.uid() = id)
       WITH CHECK (auth.uid() = id);
   ```

### Multi-Tenant Protection Guarantee
* **Database Level:** Any direct access through Supabase client keys (`anon` / `authenticated`) is automatically partitioned by PostgreSQL Row Level Security based on user identity.
* **Backend Application Level:** Every single SQL/Supabase query executed by `TodoModel` explicitly scopes records using `user_id = req.user.id`. Even if a user knows another user's Todo UUID, the database will return `404 Not Found` because it does not match their `user_id`.

---

## 7. Environment Variables

### Backend (`backend-todo/.env`)
```env
PORT=5000
NODE_ENV=development
SUPABASE_URL=https://bstgxboyjpsdwxyzixlx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d
ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

### Frontend (`frontend-todo/.env`)
```env
REACT_APP_API_URL=http://localhost:5000/api
```

> **Security Note:** Never commit `.env` files to version control. Keep secrets strictly in `backend-todo/.env`.

---

## 8. Installation & Setup

### Prerequisites
* **Node.js** (v18.0.0 or higher)
* **npm** (v9.0.0 or higher)

### 1. Backend Setup
Open Terminal 1:
```bash
cd backend-todo
npm install
```

Create `backend-todo/.env` from `.env.example` and configure your credentials:
```bash
cp .env.example .env
```

Start the backend development server:
```bash
npm run dev
```
The backend server runs on `http://localhost:5000`.

### 2. Frontend Setup
Open Terminal 2:
```bash
cd frontend-todo
npm install
```

Create `frontend-todo/.env` from `.env.example`:
```bash
cp .env.example .env
```

Start the React development server:
```bash
npm start
```
The React frontend opens at `http://localhost:3000`.

---

## 9. API Documentation & Testing Guide

All API responses follow a uniform JSON structure:

**Success Response:**
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error description message"
}
```

### 1. Health Check
* **Endpoint:** `GET /api/health`
* **Headers:** None
* **Response (200 OK):**
```json
{
  "success": true,
  "message": "Todo API is running"
}
```

---

### 2. User Registration
* **Endpoint:** `POST /api/auth/register`
* **Headers:** `Content-Type: application/json`
* **Request Body:**
```json
{
  "name": "Vinay Sharma",
  "email": "vinay@example.com",
  "password": "Password123"
}
```
* **Response (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "c1f190e8-0728-4e89-8d76-e17f0a823b12",
      "name": "Vinay Sharma",
      "email": "vinay@example.com",
      "created_at": "2026-09-25T12:00:00.000Z",
      "updated_at": "2026-09-25T12:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### 3. User Login
* **Endpoint:** `POST /api/auth/login`
* **Headers:** `Content-Type: application/json`
* **Request Body:**
```json
{
  "email": "vinay@example.com",
  "password": "Password123"
}
```
* **Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "c1f190e8-0728-4e89-8d76-e17f0a823b12",
      "name": "Vinay Sharma",
      "email": "vinay@example.com",
      "created_at": "2026-09-25T12:00:00.000Z",
      "updated_at": "2026-09-25T12:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### 4. Get Current User Profile
* **Endpoint:** `GET /api/auth/me`
* **Headers:** `Authorization: Bearer <YOUR_JWT_TOKEN>`
* **Response (200 OK):**
```json
{
  "success": true,
  "message": "User profile retrieved successfully",
  "data": {
    "user": {
      "id": "c1f190e8-0728-4e89-8d76-e17f0a823b12",
      "name": "Vinay Sharma",
      "email": "vinay@example.com",
      "created_at": "2026-09-25T12:00:00.000Z",
      "updated_at": "2026-09-25T12:00:00.000Z"
    }
  }
}
```

---

### 5. Create Todo
* **Endpoint:** `POST /api/todos`
* **Headers:** 
  * `Authorization: Bearer <YOUR_JWT_TOKEN>`
  * `Content-Type: application/json`
* **Request Body:**
```json
{
  "title": "Learn Node.js",
  "description": "Study Express MVC architecture and security"
}
```
* **Response (201 Created):**
```json
{
  "success": true,
  "message": "Todo created successfully",
  "data": {
    "todo": {
      "id": "93b2a59a-df34-4364-9642-4f95e26c6d05",
      "user_id": "c1f190e8-0728-4e89-8d76-e17f0a823b12",
      "title": "Learn Node.js",
      "description": "Study Express MVC architecture and security",
      "completed": false,
      "created_at": "2026-09-25T12:05:00.000Z",
      "updated_at": "2026-09-25T12:05:00.000Z"
    }
  }
}
```

---

### 6. Get All User Todos
* **Endpoint:** `GET /api/todos`
* **Headers:** `Authorization: Bearer <YOUR_JWT_TOKEN>`
* **Response (200 OK):**
```json
{
  "success": true,
  "message": "Todos retrieved successfully",
  "data": {
    "todos": [
      {
        "id": "93b2a59a-df34-4364-9642-4f95e26c6d05",
        "user_id": "c1f190e8-0728-4e89-8d76-e17f0a823b12",
        "title": "Learn Node.js",
        "description": "Study Express MVC architecture and security",
        "completed": false,
        "created_at": "2026-09-25T12:05:00.000Z",
        "updated_at": "2026-09-25T12:05:00.000Z"
      }
    ]
  }
}
```

---

### 7. Get Single Todo by ID
* **Endpoint:** `GET /api/todos/:id`
* **Headers:** `Authorization: Bearer <YOUR_JWT_TOKEN>`
* **Response (200 OK):**
```json
{
  "success": true,
  "message": "Todo retrieved successfully",
  "data": {
    "todo": {
      "id": "93b2a59a-df34-4364-9642-4f95e26c6d05",
      "user_id": "c1f190e8-0728-4e89-8d76-e17f0a823b12",
      "title": "Learn Node.js",
      "description": "Study Express MVC architecture and security",
      "completed": false,
      "created_at": "2026-09-25T12:05:00.000Z",
      "updated_at": "2026-09-25T12:05:00.000Z"
    }
  }
}
```

---

### 8. Update Todo
* **Endpoint:** `PUT /api/todos/:id`
* **Headers:** 
  * `Authorization: Bearer <YOUR_JWT_TOKEN>`
  * `Content-Type: application/json`
* **Request Body:**
```json
{
  "title": "Learn Node.js and Express",
  "description": "Completed MVC and Supabase integration",
  "completed": true
}
```
* **Response (200 OK):**
```json
{
  "success": true,
  "message": "Todo updated successfully",
  "data": {
    "todo": {
      "id": "93b2a59a-df34-4364-9642-4f95e26c6d05",
      "user_id": "c1f190e8-0728-4e89-8d76-e17f0a823b12",
      "title": "Learn Node.js and Express",
      "description": "Completed MVC and Supabase integration",
      "completed": true,
      "created_at": "2026-09-25T12:05:00.000Z",
      "updated_at": "2026-09-25T12:10:00.000Z"
    }
  }
}
```

---

### 9. Delete Todo
* **Endpoint:** `DELETE /api/todos/:id`
* **Headers:** `Authorization: Bearer <YOUR_JWT_TOKEN>`
* **Response (200 OK):**
```json
{
  "success": true,
  "message": "Todo deleted successfully",
  "data": null
}
```

---

## 10. Security Checklist

* [x] **Row Level Security (RLS)** enabled on `users` and `todos`.
* [x] **RLS Policies** enforce that users can only select, insert, update, and delete their own records.
* [x] **Multi-tenant isolation:** Backend controllers and models strictly attach and filter by `req.user.id`.
* [x] **Password Protection:** Plain-text passwords are NEVER stored; hashed with `bcryptjs` using 10 salt rounds.
* [x] **Password Exclusion:** Password hash is excluded from all user query responses and JWT payloads.
* [x] **Credential Protection:** `SUPABASE_SERVICE_ROLE_KEY` is strictly confined to the backend server and never sent to frontend clients.
* [x] **JWT Authentication:** Strict Bearer token validation with configurable expiry and secret stored in `.env`.
* [x] **Input Validation:** Validation middleware strictly checks types, lengths, email formats, and required fields.
* [x] **CORS Configuration:** Origin whitelist protects backend endpoints against cross-origin unauthorized invocation.
* [x] **Error Sanitization:** Internal stack traces and database error internals are sanitized in production responses.

---

## 11. Production Deployment Guide

### Backend Deployment (e.g. Render, Railway, AWS ECS, Fly.io)
1. Set Environment Variables in production dashboard:
   - `NODE_ENV=production`
   - `PORT=5000` (or assigned provider port)
   - `SUPABASE_URL=https://bstgxboyjpsdwxyzixlx.supabase.co`
   - `SUPABASE_SERVICE_ROLE_KEY=<your_production_service_role_key>`
   - `JWT_SECRET=<strong_random_jwt_secret>`
   - `ALLOWED_ORIGINS=https://your-frontend-domain.com`
2. Build command: `npm install --omit=dev`
3. Start command: `node src/server.js`

### Frontend Deployment (e.g. Vercel, Netlify, Cloudflare Pages, S3/CloudFront)
1. Set Build Environment Variables:
   - `REACT_APP_API_URL=https://your-backend-api-domain.com/api`
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Set Single Page Application rewrite rule:
   - Rewrite `/*` to `/index.html` (e.g., `_redirects` file with `/* /index.html 200` on Netlify or `vercel.json` rewrites on Vercel).
