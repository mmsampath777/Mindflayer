# Mindflayer.io - Event Management System

A full-stack Stranger Things inspired web application for IT department events.

## 🚀 Quick Start

### 1. Backend Setup
```bash
cd server
npm install
```
Create a `.env` file in the `server` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secure_random_secret
ADMIN_PASSWORD=your_admin_access_password
```

Run the server:
```bash
npm start
```

### 2. Frontend Setup
```bash
cd client
npm install
npm run dev
```

## 🔐 Security Features
- JWT-based authentication for Admin.
- Middleware protection for all sensitive routes.
- Automatic fallback for JWT secrets if not provided.
- Backend validation for event start times and round sequences.

## 🛠 Tech Stack
- **Frontend:** React + Vite, Tailwind CSS, Framer Motion, Lucide React
- **Backend:** Node.js, Express, MongoDB + Mongoose
- **Others:** JWT, ExcelJS (xlsx)

## 🎨 UI Theme
- **Theme:** Stranger Things / Horror / Dark Neon
- **Primary Color:** #ff0000 (Neon Red)
- **Background:** #050505 (Deep Black)
- **Effects:** Glitch, Glow, Cinematic Splash Screen
