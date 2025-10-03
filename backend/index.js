const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const initializeSocket = require('./services/socketManager');

dotenv.config();
connectDB();

const app = express();

const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:3000',
  'http://localhost:5173' // Add Vite's default port
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

app.use(express.json());

app.get('/', (req, res) => {
    res.send('CodeMate API is running...');
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/sessions',require('./routes/sessionRoutes'));
app.use('/api/execute', require('./routes/executionRoutes'));

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    // We provide an array of allowed origins
    origin: [
      "http://localhost:3000", 
      "http://localhost:5173"  
    ],
    methods: ["GET", "POST"]
  }
});
initializeSocket(io);


server.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
