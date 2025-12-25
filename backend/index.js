
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const initializeSocket = require('./services/socketManager');
require('dotenv').config();
// dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Define allowed origins for production (Vercel) and development
const allowedOrigins = [
  process.env.FRONTEND_URL, // e.g., https://your-app.vercel.app
  'http://localhost:5173',   // Local Vite dev port
  'http://localhost:3000'    // Local fallback
];

// Configure CORS for Express REST API
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    
    // Check if the origin is in our whitelist
    if (allowedOrigins.indexOf(origin) !== -1 || !process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// Basic health check route
app.get('/', (req, res) => {
  res.send('CodeMate API is running...');
});

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/sessions', require('./routes/sessionRoutes'));
app.use('/api/execute', require('./routes/executionRoutes'));

const server = http.createServer(app);

// Configure CORS for Socket.io
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true
  },
  // Adding transport options can sometimes help with stability on Render
  transports: ['websocket', 'polling']
});

// Initialize Socket logic
initializeSocket(io);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});