Roxiler Assignment – Store Rating Application (Full Stack)

A full-stack web application where users can rate stores, store owners can view reviews, and admins can manage users and stores.

Deployed Links

Frontend URL: https://roxiler-assignment-rating-application.onrender.com

Backend API URL: https://your-backend-url.com

(Replace with your actual deployed links)

Tech Stack
Frontend

React (Vite)

React Router DOM

Context API

Axios

Tailwind CSS

Lucide React Icons

Backend

Node.js

Express.js

SQLite

JWT Authentication

Role-based Authorization

bcrypt

CORS

express-validator / Joi

Environment Variables (Backend)

Create .env inside backend folder:

PORT=3000
JWT_SECRET_KEY=your_secret_key

How to Run Locally
Backend
cd backend
npm install
npm run dev


Runs at: http://localhost:3000

Frontend
cd frontend
npm install
npm run dev


Runs at: http://localhost:5173

User Roles

Admin

Store Owner

Customer (User)

Access to pages and APIs is controlled using JWT and role-based middleware.

Authentication Flow

Login returns JWT token

Token stored in Context API

Token sent using Axios Authorization header

Routes protected using:

ProtectedRoute

PublicRoute

Auto redirect by role:

Admin → /admin

Owner → /owner

User → /

Backend Structure
backend/
 ├─ controllers/
 │   ├─ admin.controller.js
 │   ├─ auth.controller.js
 │   ├─ owner.controller.js
 │   └─ user.controller.js
 ├─ middleware/
 │   ├─ auth.middleware.js
 │   └─ validate.middleware.js
 ├─ routes/
 │   ├─ admin.routes.js
 │   ├─ auth.routes.js
 │   ├─ owner.routes.js
 │   └─ user.routes.js
 ├─ schemas/
 ├─ mydatabase.db
 ├─ server.js
 ├─ .env
 └─ package.json

Backend API Routes
Base Routes
/api/auth
/api/admin
/api/owner
/api/user

Auth Routes — /api/auth
Method	Route	Description
POST	/signup	Register user
POST	/login	Login
POST	/logout	Logout
PATCH	/update-password	Update password
Admin Routes — /api/admin (Admin only)
Method	Route	Description
POST	/users	Add new user
GET	/dashboard	Dashboard stats
GET	/stores	View stores
POST	/stores	Add store
GET	/users	Search and filter users
GET	/users/:id	View user details
GET	/allusers	Get all users

Admin Features:

View total users, stores, and ratings

Search and sort users by name, email, address

Add user with validations:

Name: 20–60 characters

Address: up to 400 characters

Strong password (uppercase and special character)

Add store with:

Store name

Email

Address

Owner selection

Owner Routes — /api/owner (Store Owner only)
Method	Route	Description
GET	/dashboard	Store rating stats
GET	/reviews	Recent reviews

Owner Features:

View store rating

See recent reviews with username, store name, and star rating

User Routes — /api/user (Customer only)
Method	Route	Description
GET	/stores	View stores (paginated)
POST	/ratings	Add rating
PATCH	/ratings/:storeId	Update rating

User Features:

Search stores by name and location

Add and update ratings

Pagination with limit = 6 per page

Update password

Logout

Pagination

Backend:

limit = 6

page sent as query parameter

Frontend reloads data on:

Rating update

Search

Sort

Frontend Features

Vite + React

Context API for auth, token, and user data

API status handling: Initial, Loading, Success, Failure

Components:

ProtectedRoute

PublicRoute

Loader

StarRating

Fully responsive UI using Tailwind CSS

Icons using Lucide React

Frontend Structure (Main)
src/
 ├─ components/
 │   ├─ Header.jsx
 │   ├─ Footer.jsx
 │   ├─ ProtectedRoute.jsx
 │   ├─ PublicRoute.jsx
 │   ├─ StarRating.jsx
 │   └─ Loader.jsx
 ├─ context/
 │   └─ storeContext.jsx
 ├─ pages/
 │   ├─ Login.jsx
 │   ├─ Signup.jsx
 │   ├─ Dashboard.jsx
 │   ├─ AdminDashboard.jsx
 │   └─ OwnerDashboard.jsx
 └─ App.jsx

Security

Password hashing using bcrypt

JWT token verification

Role-based API protection

Input validation using Joi and express-validator

Highlights

Role-based dashboards

Fast API refresh after every action

Responsive UI for all devices

Proper error handling

Search, sort, and pagination

Secure authentication system