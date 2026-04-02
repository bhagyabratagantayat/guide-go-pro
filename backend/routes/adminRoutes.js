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

router.get('/users', adminController.getUsers);
router.delete('/users/:id', adminController.deleteUser);

router.get('/guides', adminController.getGuides);
router.put('/guides/approve/:id', adminController.approveGuide);
router.delete('/guides/reject/:id', adminController.rejectGuide);

router.get('/bookings', adminController.getBookings);
router.get('/reports', adminController.getReports);

router.post('/locations', adminController.addLocation);
router.put('/locations/:id', adminController.updateLocation);
router.delete('/locations/:id', adminController.deleteLocation);

module.exports = router;
