# Natours Project

A full-stack tour booking application where users can browse, book, and review adventurous tours around the world.

Built using **MERN Stack**:
- **MongoDB** for the database
- **Express.js** for the backend API
- **React.js** for the frontend
- **Node.js** as the server runtime

---

## 🚀 Features

- Secure user authentication and authorization using JWT
- Role-based access control (admin, guide, user)
- Tour filtering, sorting, pagination, and searching
- Tour booking with **Stripe** payment gateway
- Image uploading with **Multer** and image processing with **Sharp**
- Review and rating system
- Fully responsive **React frontend**
- **Admin Dashboard to manage users, tours, and bookings**

---

## 🛠️ Tech Stack

### Backend:
- Node.js
- Express.js
- MongoDB & Mongoose
- JWT, Bcrypt, Multer, Sharp, Nodemailer, Stripe

### Frontend:
- React.js (with hooks and context API)
- Axios for API requests
- React Router for navigation
---
### Config
- PORT=5000
- NODE_ENV=development
- DATABASE_USERNAME=your_username
- DATABASE=mongodb+srv://<USERNAME>:<PASSWORD>@clusters.ewclw.mongodb.net/natours?retryWrites=true&w=majority&appName=Clusters
- DATABASE_PASSWORD=your_password
- JWT_REFRESH_SECRET=your_refresh_token_secret
- JWT_ACCESS_SECRET=your_access_token_secret
- ACCESS_TOKEN_EXPIRES_IN=10m
- REFRESH_TOKEN_EXPIRES_IN=90d
- ACCESS_COOKIE_EXPIRES_IN=10
- REFRESH_COOKIE_EXPIRES_IN=90
- EMAIL_USERNAME=your_email_username
- EMAIL_PASSWORD=your_email_password
- EMAIL_HOST=smtp.yourprovider.com
- EMAIL_PORT=587
- STRIPE_SECRET_KEY=your_stripe_key
