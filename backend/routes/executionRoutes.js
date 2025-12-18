const express = require('express');
const router = express.Router();
const { executeCode } = require('../controllers/executionController');
const authMiddleware = require('../middleware/authMiddleware');

// Any authenticated user can execute code
router.post('/', authMiddleware, executeCode);

module.exports = router;
