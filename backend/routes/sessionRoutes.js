const express = require('express');
const router = express.Router();
const { create, get, getActiveSessions } = require('../controllers/sessionController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.post('/create', authMiddleware, create);
router.get('/:roomId', authMiddleware, get);
router.get('/active/dashboard', authMiddleware, roleMiddleware('TA'), getActiveSessions);
module.exports = router;
