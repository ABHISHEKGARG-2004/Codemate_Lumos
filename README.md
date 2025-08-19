# CodeMate - Collaborative Coding Platform (Backend)

![Status](https://img.shields.io/badge/status-in_development-orange)

This repository contains the backend server for **CodeMate**, a real-time collaborative coding platform designed to enhance the mentoring experience for students and teaching assistants.

## 📝 Problem Statement

In many online learning environments, students find it difficult to articulate their coding issues over text-based chat. This often leads to inefficient communication, delays in doubt resolution, and a frustrating experience for both students and mentors. CodeMate aims to solve this by providing a live, shared coding environment with integrated voice support, making it easier to debug and learn collaboratively.

## ✨ Key Features

* **JWT-Based Authentication:** Secure user registration and login with support for distinct user roles ('Student' and 'TA').
* **Session Management:** Users can create and join unique coding session rooms. Sessions are persistent and can be revisited.
* **Real-Time Collaboration (via Socket.IO):**
    * Live code syncing between all participants in a room.
    * Real-time notifications when users join or leave a session.
    * "Raise Hand" feature for students to notify TAs.
* **TA Dashboard Support:** An API endpoint for TAs to view all active sessions, with priority given to those where a student has raised their hand.

## 🛠️ Tech Stack

* **Backend:** Node.js
* **Framework:** Express.js
* **Database:** MongoDB with Mongoose (ODM)
* **Authentication:** JSON Web Tokens (JWT), bcrypt.js
* **ID Generation:** UUID (v4) for unique room IDs

📂 Project Structure
The project follows a modular structure to ensure a clean and scalable codebase.

/
├── config/
│   └── db.js             # MongoDB connection logic
├── controllers/
│   ├── authController.js   # Logic for user authentication
│   └── sessionController.js# Logic for session management
├── middleware/
│   ├── authMiddleware.js   # JWT token validation
│   └── roleMiddleware.js   # Role-based access control
├── models/
│   ├── Session.js        # Mongoose schema for sessions
│   └── User.js           # Mongoose schema for users
├── routes/
│   ├── authRoutes.js     # API routes for authentication
│   └── sessionRoutes.js  # API routes for sessions
├── services/
│   └── socketManager.js  # Socket.IO event handling
├── .env                  # Environment variables (private)
├── .gitignore            # Files to ignore in git
├── package.json          # Project dependencies and scripts
└── server.js             # Main server entry point
