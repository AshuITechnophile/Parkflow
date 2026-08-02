const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  facility: { type: mongoose.Schema.Types.ObjectId, ref: 'ParkingFacility', required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  actualExitTime: { type: Date }, // To calculate Overstay or Early Exit Refund
  totalAmount: { type: Number, required: true },
  paymentStatus: { type: String, enum: ['Pending', 'Paid', 'Refunded', 'OverstayCharged'], default: 'Pending' },
  entryCode: { type: String }, // QR code string or PIN for entry
  isEVBooking: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', bookingSchema);