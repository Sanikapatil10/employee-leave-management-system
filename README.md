# Employee Leave Management System

A full-stack Employee Leave Management System built with React (Frontend) and Node.js/Express with MySQL (Backend).

## Features

- **Employee Features:**
  - Login/Register
  - Apply for leave (Sick, Casual, Annual)
  - View own leave history
  - Track leave status (Pending, Approved, Rejected)
  - Dashboard with leave statistics

- **Admin Features:**
  - View all employee leave requests
  - Approve or reject leave requests
  - Admin dashboard with overview

## Tech Stack

### Frontend
- React.js
- React Router
- Axios
- CSS

### Backend
- Node.js
- Express.js
- MySQL
- JWT (JSON Web Tokens)

## Project Structure

```
Employee Leave Management System/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   └── leave.controller.js
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │   └── role.middleware.js
│   ├── models/
│   │   ├── leave.model.js
│   │   └── user.model.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   └── leave.routes.js
│   ├── server.js
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── services/
    │   ├── styles/
    │   ├── App.js
    │   └── index.js
    └── package.json
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MySQL (v5.7 or higher)

### Database Setup

1. Create a MySQL database named `leave_management`:
```sql
CREATE DATABASE leave_management;
```

2. Update the `.env` file in the backend with your MySQL credentials:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=leave_management
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```
Or for development with auto-reload:
```bash
npm run dev
```

The server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will open at `http://localhost:3000`

## Default Admin Account

After starting the server, you can register a new admin user through the registration page, or use SQL to create one:

```sql
INSERT INTO users (name, email, password, role) 
VALUES ('Admin', 'admin@example.com', 'admin123', 'admin');
```

Note: Passwords are stored as plain text in this demo. In production, use bcrypt for password hashing.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Leave Management
- `POST /api/leaves/apply` - Apply for leave (Employee)
- `GET /api/leaves/my-leaves` - Get own leaves (Employee)
- `GET /api/leaves/all` - Get all leaves (Admin only)
- `PUT /api/leaves/status` - Update leave status (Admin only)

## Troubleshooting

### Issue: Leaves table doesn't exist
If you get an error about the leaves table, make sure to restart the backend server after setting up the database. The server will automatically create the required tables.

### Issue: Column 'days' doesn't exist
If you have an existing leaves table, run:
```sql
ALTER TABLE leaves ADD COLUMN days INT NOT NULL DEFAULT 1;
```

### Issue: CORS errors
Make sure both frontend and backend are running. The backend is configured to allow CORS from any origin.

## License

This project is for educational purposes.

