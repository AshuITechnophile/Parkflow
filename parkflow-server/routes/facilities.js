const express = require('express');
const ParkingFacility = require('../models/ParkingFacility');

const router = express.Router();

// @route   GET /api/facilities
// @desc    Get all parking facilities (with optional search/filters)
router.get('/', async (req, res) => {
  try {
    const { evCharging, activeSurge } = req.query;
    
    // Build query object based on frontend filters
    let query = {};
    if (evCharging === 'true') query.hasEVCharging = true;
    if (activeSurge === 'true') query.isSurgePricingActive = true;

    const facilities = await ParkingFacility.find(query);
    res.json(facilities);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/facilities
// @desc    Add a new parking facility (For Facility Owners)
router.post('/', async (req, res) => {
  try {
    const newFacility = new ParkingFacility(req.body);
    const savedFacility = await newFacility.save();
    res.status(201).json(savedFacility);
  } catch (err) {
    res.status(500).json({ error: 'Server error while adding facility' });
  }
});

module.exports = router;