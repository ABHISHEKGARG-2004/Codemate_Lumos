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

config/: Holds configuration files, such as the database connection logic (db.js).

controllers/: Contains the business logic for handling API requests.

middleware/: Stores functions that execute before the controller logic, used for authentication and role checks.

models/: Defines the Mongoose schemas for the database collections.

routes/: Defines the API endpoints and maps them to controller functions.

services/: Contains modules for specific business logic, like socketManager.js for real-time events.

server.js: The main entry point that initializes the Express server.

.env: Stores all environment variables (e.g., database URI, JWT secret).

package.json: Lists all project dependencies and defines scripts.


## 🚀 Getting Started

Follow these instructions to get a local copy of the project up and running.

### Prerequisites

* [Node.js](https://nodejs.org/en/) (v14 or higher)
* [MongoDB](https://www.mongodb.com/try/download/community) (or a free MongoDB Atlas account)
* `npm` (Node Package Manager)

### Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone [https://github.com/your-username/codemate-backend.git](https://github.com/your-username/codemate-backend.git)
    cd codemate-backend
    ```

2.  **Install dependencies:**
    ```sh
    npm install
    ```

3.  **Create an environment file:**
    Create a `.env` file in the root of the project and add the following variables.

    ```env
    # Server Configuration
    PORT=5000
    FRONTEND_URL=http://localhost:3000

    # MongoDB Connection String
    MONGO_URI=your_mongodb_connection_string

    # JWT Secret Key
    JWT_SECRET=a_very_strong_and_secret_key_for_jwt
    ```

### Running the Server

* **Development Mode:**
    This command uses `nodemon` to automatically restart the server on file changes.
    ```sh
    npm run dev
    ```

* **Production Mode:**
    ```sh
    npm start
    ```

The server will be running at `http://localhost:5000`.

## 🔌 API Endpoints

The following are the available REST API endpoints.

| Method | Endpoint                             | Description                             | Protected |
| :----- | :----------------------------------- | :-------------------------------------- | :-------- |
| `POST` | `/api/auth/register`                 | Register a new user.                    | No        |
| `POST` | `/api/auth/login`                    | Log in a user and get a JWT token.      | No        |
| `GET`  | `/api/auth/profile`                  | Get the profile of the logged-in user.  | Yes       |
| `POST` | `/api/sessions/create`               | Create a new coding session.            | Yes       |
| `GET`  | `/api/sessions/:roomId`              | Get details of a specific session.      | Yes       |
| `GET`  | `/api/sessions/active/ta-dashboard`  | Get all sessions for the TA dashboard.  | Yes (TA)  |
