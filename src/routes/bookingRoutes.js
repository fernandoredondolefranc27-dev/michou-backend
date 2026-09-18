const express = require('express');
const router = express.Router();
const { createBooking, getBookingByPass } = require('../controllers/bookingController');

router.post('/', createBooking);
router.get('/:passId', getBookingByPass);

module.exports = router;