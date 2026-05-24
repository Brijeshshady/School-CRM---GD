# School CRM v42

A modern, full-stack School Management System (CRM) built with React, Node.js, and MongoDB. This application provides a streamlined experience for students, teachers, and administrators to manage academic life.

# [Link](https://school-crm-blond.vercel.app/)
```
https://school-crm-blond.vercel.app/
```

## 🚀 Features

### Core Modules
- **JWT Authentication**: Secure stateless authentication with role-based persistence.
- **RBAC (Role Based Access Control)**: Granular permissions for Students, Teachers, and Admins.
- **Student Dashboard**: Overview of grades, assignments, and attendance history.
- **Teacher Dashboard**: Tools for marking attendance and creating assignments.
- **Attendance System**: Real-time attendance tracking with class-based filtering.
- **Assignment System**: End-to-end workflow from creation to student viewing.

### Tech Stack
- **Frontend**: React (Vite), Tailwind CSS, React Query, Axios.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (Mongoose).
- **Authentication**: JWT (JSON Web Tokens), Bcryptjs.

## 🛠️ Local Setup

### 1. Prerequisites
- Node.js (v18 or higher)
- MongoDB (Local or Atlas)

### 2. Backend Configuration
Navigate to the `server` directory and create a `.env` file:
```bash
cd server
npm install
```
`.env` contents:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/school_crm
JWT_SECRET=your_secret_key
NODE_ENV=development
```
Start the backend:
```bash
npm run dev
```

### 3. Frontend Configuration
In the root directory:
```bash
npm install
```
Start the frontend:
```bash
npm run dev
```

## 📊 Deployment

- **Frontend**: Optimized for [Vercel](https://vercel.com).
- **Backend**: Optimized for [Render](https://render.com) or Heroku.
- **Database**: Recommended [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).

## 🔑 Demo Credentials

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@school.com` | `password123` |
| **Teacher** | `teacher1@school.com` | `password123` |
| **Student** | `student1@school.com` | `password123` |

---
Developed as a high-performance educational management solution.
