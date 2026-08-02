const mongoose = require('mongoose');

const parkingFacilitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: {
    address: { type: String, required: true },
    coordinates: { lat: Number, lng: Number } // For Map Integration
  },
  capacity: { type: Number, required: true }, // Overall capacity
  availableSlots: { type: Number, required: true },
  basePricePerHour: { type: Number, required: true },
  isSurgePricingActive: { type: Boolean, default: false }, // For Dynamic Pricing
  hasEVCharging: { type: Boolean, default: false }, // EV Charging Slots flag
  rating: { type: Number, default: 0 } // For Reviews & Ratings
});

module.exports = mongoose.model('ParkingFacility', parkingFacilitySchema);