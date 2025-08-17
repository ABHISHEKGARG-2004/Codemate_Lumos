const express = require('express');
const router = express.Router();
const { create } = require('../controllers/sessionController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/create', authMiddleware, create);


module.exports = router;