const express = require('express');
const { createBooking, acceptBooking, startTrip, endTrip } = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

router.use(protect);

router.post('/create', createBooking);
router.post('/accept/:id', authorize('guide'), acceptBooking);
router.post('/start', authorize('guide'), startTrip);
router.post('/end', authorize('guide'), endTrip);

module.exports = router;
