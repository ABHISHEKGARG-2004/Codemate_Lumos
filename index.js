const express = require('express');
const http = require('http');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true
}));
app.use(express.json());

app.get('/', (req, res) => {
    res.send('CodeMate API is running...');
});

const PORT = process.env.PORT || 5000;

// Create server before using .listen()
const server = http.createServer(app);

server.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
