# Project Management System

A full-stack web application for creating projects, managing tasks, and tracking project progress through a Kanban-style workflow.

## 🚀 Live Demo

[View Live Project](https://project-management-1qsb8c5o8-pranali9.vercel.app)

## 📂 GitHub Repository

[View Source Code](https://github.com/pranalishinde22/project-management)

---

## 📌 About the Project

The Project Management System is a full-stack web application developed as a final-year college project.

The application allows users to create an account, manage projects, create and organize tasks, update task statuses, and track project progress through an interactive Kanban board.

The system includes authentication, project management, task management, responsive design, dark mode, calendar view, settings, and profile management.

---

## ✨ Features

### 🔐 Authentication

- User registration
- User login and logout
- JWT-based authentication
- Protected routes
- Password hashing using bcrypt
- Email validation
- Password visibility toggle

### 📁 Project Management

- Create projects
- Edit projects
- Delete projects
- View project details
- Organize tasks within projects

### ✅ Task Management

- Create tasks
- Edit tasks
- Delete tasks
- Set task priority
- Set due dates
- Assign tasks
- Update task status
- Drag and drop tasks between columns

### 📊 Kanban Board

Tasks can be organized into three workflow stages:

- **To Do**
- **Processing**
- **Completed**

Users can move tasks between columns using drag and drop.

### 🎨 User Interface

- Responsive design
- Light and dark mode
- Dashboard
- Calendar view
- Settings page
- Profile menu
- Profile picture support
- Search functionality
- Toast notifications
- Logout confirmation
- Mobile-friendly layout

---

## 🛠️ Technologies Used

### Frontend

- React.js
- Vite
- Tailwind CSS
- React Router
- JavaScript
- HTML
- CSS

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Token (JWT)
- bcryptjs
- CORS

### Deployment & Tools

- Vercel
- Render
- MongoDB Atlas
- GitHub
- Git

---

## 🏗️ Project Structure

```text
Project Management
│
├── Backend
│   ├── db
│   │   └── db.js
│   │
│   ├── src
│   │   ├── middleware
│   │   │   └── authMiddleware.js
│   │   │
│   │   ├── models
│   │   │   ├── User.js
│   │   │   ├── Project.js
│   │   │   └── Task.js
│   │   │
│   │   └── routes
│   │       ├── authRoutes.js
│   │       ├── projectRoutes.js
│   │       └── taskRoutes.js
│   │
│   ├── app.js
│   ├── server.js
│   └── package.json
│
├── Frontend
│   ├── src
│   │   ├── components
│   │   ├── context
│   │   ├── pages
│   │   ├── services
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   └── package.json
│
├── .gitignore
└── README.md