const express = require('express');
const { registerGuide, getNearbyGuides, updateLocation } = require('../controllers/guideController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const uploadGuideDocs = require('../middleware/upload');

const router = express.Router();

// Public routes
router.get('/nearby', getNearbyGuides);

// Protected routes
router.post('/register', protect, uploadGuideDocs, registerGuide);
router.post('/update-location', protect, authorize('guide'), updateLocation);

module.exports = router;
