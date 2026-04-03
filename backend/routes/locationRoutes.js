const express = require('express');
const router = express.Router();
const { getLocations, getGuidesCountAtLocation } = require('../controllers/locationController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getLocations);
router.get('/:id/guides-count', getGuidesCountAtLocation);

module.exports = router;
