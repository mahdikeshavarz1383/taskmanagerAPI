# ✅ Task Manager API

A secure and personal task management REST API.
Each user can only see and manage their own tasks.
Built with **Node.js**, **Express.js**, and **MongoDB**.

Developed by **Mahdi Keshavarz**

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- npm
- MongoDB (local)

### Installation

git clone https://github.com/mahdikeshavarz1383/task-manager-api.git
cd task-manager-api
npm install

### Setup .env file
MONGO_URI=mongodb://localhost:27017/taskDB

node app.js

Server runs on: http://localhost:3000

---

## 📡 API Endpoints

### 🔓 Public Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /register | Register a new user |
| POST | /login | Login and get JWT token |

### 🔐 Protected Routes (Token required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /tasks | Get YOUR tasks only |
| POST | /tasks | Create a new task |
| PUT | /tasks/:id | Update a task |
| DELETE | /tasks/:id | Delete a task |

---

## 📥 Request Examples

### Register
{
  "username": "mahdi",
  "password": "1234"
}

### Login Response
{
  "message": "logged in",
  "token": "eyJhbGciOiJIUzI1NiIs..."
}

### Create Task
{
  "taskname": "Study Node.js",
  "completed": false
}

### Task Response
{
  "message": "added",
  "newTasks": {
    "_id": "...",
    "title": "Study Node.js",
    "completed": false,
    "user": "user_id_here"
  }
}

---

## 🔒 How to Authenticate

1. Register via /register
2. Login via /login to get your token
3. Add token to request headers:

Key: authorization
Value: your_token_here

---

## 🌟 Key Feature

Every user sees ONLY their own tasks.
No user can access another user's data. 🔐

---

## 🛡️ Security Features

- Passwords hashed with **bcryptjs**
- JWT token authentication
- Protected routes with middleware
- Token expires after **1 hour**
- Personal data isolation per user

---

## 🗄️ Database Models

### User
- username: String (required)
- password: String (required, hashed)

### Task
- title: String (required)
- completed: Boolean (default: false)
- user: ObjectId (ref to User)

---

## ⚙️ Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- jsonwebtoken
- bcryptjs
- dotenv

---

## 📄 License

This project is **open source** and available under
the MIT License.
Feel free to use, modify, and distribute it freely.

---

## 👨‍💻 Author

**Mahdi Keshavarz**
Computer Engineering Student
Islamic Azad University of Qazvin

GitHub: github.com/mahdikeshavarz1383
Email: mahdikeshavarz1383m@gmail.com