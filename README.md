# 💬 Chatty - Real-time Chat Application

A modern, full-stack real-time messaging platform built with the MERN stack, featuring live chat, user authentication, profile management, and a sleek responsive UI.

![Chatty Banner](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## ✨ Features

- 🔐 **User Authentication** - Secure signup/login with JWT tokens
- 💬 **Real-time Messaging** - Instant message delivery using Socket.io
- 👤 **Profile Management** - Update profile pictures and user information
- 🔍 **User Search** - Search and filter users in real-time
- 🔔 **Sound Notifications** - Audio alerts for new messages (toggleable)
- 🟢 **Online Status** - See who's currently active
- 📱 **Responsive Design** - Works seamlessly on mobile and desktop
- 🖼️ **Image Upload** - Base64 image encoding for profile pictures
- 🎨 **Modern UI** - Beautiful interface with TailwindCSS and Lucide icons
- ⚡ **State Management** - Efficient state handling with Zustand
- ✅ **Confirmation Modals** - User-friendly confirmation dialogs

## 🚀 Tech Stack

### Frontend
- **React** - UI library
- **Zustand** - State management
- **TailwindCSS** - Styling
- **Lucide React** - Icons
- **Socket.io Client** - Real-time communication
- **React Router** - Navigation

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - Database
- **Socket.io** - WebSocket communication
- **JWT** - Authentication
- **Bcrypt** - Password hashing

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Clone the repository
```bash
git clone https://github.com/krishh-9085/Chatty.git
cd Chatty
```

### Backend setup
```bash
cd backend
npm install
```
### Add these to your .env
```bash
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
NODE_ENV=development
```

### Frontend setup
```bash
cd frontend
npm install
```

### Run the Application
```bash
//Start Backend (from backend directory)
npm run dev

//Start Frontend (from frontend directory)
npm run dev

```

### The application will be available at:
```bash
Frontend: http://localhost:5173
Backend: http://localhost:5000
```
### Project Structure
<img width="562" height="371" alt="image" src="https://github.com/user-attachments/assets/e25ac5ca-489b-4bdd-9164-62487fabec8b" />

