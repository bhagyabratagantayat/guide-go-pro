const express = require('express');
const adminController = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

// All admin routes are protected and restricted to admin role
router.use(protect);
router.use(authorize('admin'));

router.get('/stats', adminController.getStats);
router.get('/config', adminController.getConfig);
router.put('/config', adminController.updateConfig);

router.get('/pending-guides', adminController.getPendingGuides);
router.put('/approve/:id', adminController.approveGuide);
router.delete('/reject/:id', adminController.rejectGuide);

module.exports = router;
