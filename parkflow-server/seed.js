const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

// Import your models
const User = require('./models/User');
const ParkingFacility = require('./models/ParkingFacility');
const Booking = require('./models/Booking');

// Load environment variables
dotenv.config();

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    // 1. Clear existing data to prevent duplicates
    await User.deleteMany();
    await ParkingFacility.deleteMany();
    await Booking.deleteMany();
    console.log('Cleared existing data.');

    // 2. Create a Dummy User
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const testUser = new User({
      name: 'Indore Driver',
      email: 'driver@indore.com',
      password: hashedPassword,
      licensePlate: 'MP09-AB-1234',
      role: 'user'
    });
    await testUser.save();
    console.log('Created test user: driver@indore.com (Password: password123)');

    // 3. Create Indore Parking Facilities
    const facilities = [
      {
        name: 'Vijay Nagar Smart Parking',
        location: {
          address: 'AB Road, Vijay Nagar, Indore, MP 452010',
          coordinates: { lat: 22.7533, lng: 75.8937 }
        },
        capacity: 150,
        availableSlots: 45,
        basePricePerHour: 50, // INR
        isSurgePricingActive: false,
        hasEVCharging: true, // EV Charging supported[cite: 2]
        rating: 4.5
      },
      {
        name: 'Rajwada Underground Parking',
        location: {
          address: 'Rajwada Chowk, Indore, MP 452002',
          coordinates: { lat: 22.7185, lng: 75.8554 }
        },
        capacity: 80,
        availableSlots: 5, // Almost full
        basePricePerHour: 40,
        isSurgePricingActive: true, // Surge pricing active due to high demand[cite: 2]
        hasEVCharging: false,
        rating: 3.8
      },
      {
        name: 'C21 Mall Parking Garage',
        location: {
          address: 'AB Road, Scheme 54 PU4, Indore, MP 452010',
          coordinates: { lat: 22.7485, lng: 75.8988 }
        },
        capacity: 300,
        availableSlots: 120,
        basePricePerHour: 60,
        isSurgePricingActive: false,
        hasEVCharging: true,
        rating: 4.8
      },
      {
        name: 'Bhawarkuan Student Square',
        location: {
          address: 'Bhawarkuan Main Road, Indore, MP 452001',
          coordinates: { lat: 22.6916, lng: 75.8674 }
        },
        capacity: 50,
        availableSlots: 0, // Fully booked
        basePricePerHour: 30,
        isSurgePricingActive: false,
        hasEVCharging: false,
        rating: 4.0
      }
    ];

    await ParkingFacility.insertMany(facilities);
    console.log('Created Indore parking facilities.');

    console.log('Database seeded successfully!');
    process.exit();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();