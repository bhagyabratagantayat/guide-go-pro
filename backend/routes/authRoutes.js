const express = require('express');
const { register, login, getMe, testLogin } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/test-login', testLogin);
router.get('/me', protect, getMe);

module.exports = router;
