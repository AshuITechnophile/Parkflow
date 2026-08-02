const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'facility_owner', 'admin'], default: 'user' }, // Facility owner added for dashboard
  licensePlate: { type: String }, // For License Plate Recognition
  stripeCustomerId: { type: String }, // For Overstay Auto-Charge
  subscriptionPass: { 
    type: String, 
    enum: ['none', 'weekly', 'monthly'], 
    default: 'none' 
  }, // For Subscription Passes
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);