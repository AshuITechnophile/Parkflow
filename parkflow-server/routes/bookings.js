const express = require('express');
const Booking = require('../models/Booking');
const ParkingFacility = require('../models/ParkingFacility');
const crypto = require('crypto'); // For generating random PINs
const auth = require('../middleware/auth'); // Import the auth middleware

const router = express.Router();

// @route   GET /api/bookings/my-bookings
// @desc    Get logged-in user's bookings
router.get('/my-bookings', auth, async (req, res) => {
  try {
    // req.user.userId comes securely from the auth middleware token
    const bookings = await Booking.find({ user: req.user.userId })
      .populate('facility', 'name location') 
      .sort({ startTime: 1 }); 

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: 'Server error fetching bookings' });
  }
});

// @route   POST /api/bookings
// @desc    Create a new booking & process payment
// FIX: Added 'auth' middleware here to protect the route
router.post('/', auth, async (req, res) => {
    try {
        // FIX: Removed userId from req.body. We now get it securely from req.user
        const { facilityId, startTime, endTime, isEVBooking } = req.body;
        const userId = req.user.userId;

        // 1. Fetch Facility Details
        const facility = await ParkingFacility.findById(facilityId);
        if (!facility || facility.availableSlots <= 0) {
            return res.status(400).json({ message: 'Facility not found or fully booked' });
        }

        // 2. Calculate Pricing based on time
        const start = new Date(startTime);
        const end = new Date(endTime);
        const hours = Math.abs(end - start) / 36e5; 

        // Apply dynamic surge pricing if active
        let rate = facility.basePricePerHour;
        if (facility.isSurgePricingActive) rate *= 1.5; 

        const totalAmount = (hours * rate).toFixed(2);

        // 3. Process Payment Gateway (Mock Stripe Integration)
        const paymentSuccessful = true;

        if (!paymentSuccessful) {
            return res.status(400).json({ message: 'Payment failed' });
        }

        // 4. Generate a 6-digit Entry PIN
        const entryCode = crypto.randomInt(100000, 999999).toString();

        // 5. Save the Booking
        const newBooking = new Booking({
            user: userId, // Securely mapped from the token
            facility: facilityId,
            startTime,
            endTime,
            totalAmount,
            entryCode,
            isEVBooking,
            paymentStatus: 'Paid'
        });

        await newBooking.save();

        // 6. Update Facility Availability
        facility.availableSlots -= 1;
        await facility.save();

        res.status(201).json(newBooking);
    } catch (err) {
        res.status(500).json({ error: 'Server error during booking' });
    }
});

// @route   POST /api/bookings/:id/exit
// @desc    Process user exit, handle overstay charges or early exit refunds
// NOTE: We will likely need to add 'auth' here later when we build the exit button
router.post('/:id/exit', async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) return res.status(404).json({ message: 'Booking not found' });

        const actualExitTime = new Date();
        booking.actualExitTime = actualExitTime;

        const scheduledEndTime = new Date(booking.endTime);

        // Check for Overstay
        if (actualExitTime > scheduledEndTime) {
            booking.paymentStatus = 'OverstayCharged';
        }
        // Check for Early Exit
        else if (actualExitTime < scheduledEndTime) {
            booking.paymentStatus = 'Refunded';
        }

        await booking.save();
        res.json({ message: 'Exit processed successfully', booking });
    } catch (err) {
        res.status(500).json({ error: 'Server error processing exit' });
    }
});

module.exports = router;