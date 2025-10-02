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

app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
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
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});
initializeSocket(io);


server.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
