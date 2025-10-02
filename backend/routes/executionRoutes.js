const express = require('express');
const router = express.Router();
const { executeCode } = require('../controllers/executionController');
const authMiddleware = require('../middleware/authMiddleware');
// used for executing the code
router.post('/', authMiddleware, executeCode);

module.exports = router;
