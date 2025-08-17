const express = require('express');
const router = express.Router();
const { create, get } = require('../controllers/sessionController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/create', authMiddleware, create);
router.get('/:roomId', authMiddleware, get);

module.exports = router;