const { 
    createBooking, 
    acceptBooking, 
    startTrip, 
    endTrip,
    getUserBookings,
    getGuideBookings
} = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

router.use(protect);

router.post('/create', authorize('user'), createBooking);
router.post('/accept/:id', authorize('guide'), acceptBooking);
router.post('/start', authorize('guide'), startTrip);
router.post('/end', authorize('guide'), endTrip);
router.get('/user-bookings', authorize('user'), getUserBookings);
router.get('/guide-bookings', authorize('guide'), getGuideBookings);

module.exports = router;
