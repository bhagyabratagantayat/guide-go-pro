const express = require('express');
const router = express.Router();

// @desc    Test route
// @route   GET /api/test
// @access  Public
router.get('/', (req, res) => {
    res.status(200).json({ success: true, message: 'GuideGo backend running' });
});

module.exports = router;
