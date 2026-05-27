const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const Student = require('../models/Student');
const DriverProfile = require('../models/DriverProfile');
const Vehicle = require('../models/Vehicle');
const VehicleRoute = require('../models/VehicleRoute');

const seedTransport = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/schoolcrm");
    console.log('Connected to database to seed transport data...');

    // 1. Clear old data
    await DriverProfile.deleteMany({});
    await Vehicle.deleteMany({});
    await VehicleRoute.deleteMany({});
    await User.deleteMany({ email: { $in: ['driver@school.com', 'helper@school.com'] } });
    console.log('Cleared existing transport and user data.');

    // 2. Create Driver and Helper Users if not present
    let driverUser = await User.create({
      name: 'Mr. Ramesh Shinde',
      email: 'driver@school.com',
      password: 'driver123',
      role: 'Driver'
    });
    console.log('✔ Created Driver User');

    let assistantUser = await User.create({
      name: 'Mr. Dilip Patil',
      email: 'helper@school.com',
      password: 'helper123',
      role: 'Helper'
    });
    console.log('✔ Created Assistant/Helper User');

    // 3. Create Vehicle
    const vehicle = await Vehicle.create({
      vehicleNumber: 'MH-12-EQ-8844',
      capacity: 40,
      model: 'Tata Starbus 40-Seater',
      status: 'Active',
      driver: driverUser._id,
      assistant: assistantUser._id
    });
    console.log('✔ Created Fleet Vehicle');

    // 4. Create Driver Profiles
    await DriverProfile.create({
      user: driverUser._id,
      role: 'Driver',
      licenseNumber: 'DL-14202655339',
      licenseExpiry: new Date('2030-12-31'),
      contactNumber: '+91 9876543210',
      assignedVehicle: vehicle._id
    });

    await DriverProfile.create({
      user: assistantUser._id,
      role: 'Assistant',
      licenseNumber: 'N/A',
      contactNumber: '+91 9876543211',
      assignedVehicle: vehicle._id
    });
    console.log('✔ Created Driver & Assistant Profiles');

    // 5. Find student Aarav Kumar
    const aaravUser = await User.findOne({ email: 'aarav.kumar@school.edu.in' });
    let studentId = null;
    if (aaravUser) {
      const student = await Student.findOne({ user: aaravUser._id });
      if (student) {
        studentId = student._id;
        console.log('Found Aarav Kumar Student ID:', studentId);
      }
    }

    // 6. Create Route
    const route = await VehicleRoute.create({
      routeName: 'Chennai Anna Nagar Route',
      routeNumber: 'R-101',
      vehicleNumber: 'TN-02-AX-4889',
      vehicle: vehicle._id,
      driver: driverUser._id,
      assistant: assistantUser._id,
      stops: [
        { stopName: 'Anna Nagar Roundtana', latitude: 13.0850, longitude: 80.2120, scheduledTime: '07:30 AM' },
        { stopName: 'Thirumangalam Stop', latitude: 13.0851, longitude: 80.1983, scheduledTime: '07:45 AM' },
        { stopName: 'Koyambedu Bus Stop', latitude: 13.0722, longitude: 80.2100, scheduledTime: '08:00 AM' },
        { stopName: 'CPS School Campus Chennai', latitude: 13.0780, longitude: 80.2180, scheduledTime: '08:20 AM' }
      ],
      studentsAllocated: studentId ? [{ student: studentId, stopName: 'Thirumangalam Stop' }] : []
    });
    console.log('✔ Created VehicleRoute and allocated Aarav Kumar to "Thirumangalam Stop"');

    console.log('✔ Transport Seeding Completed Successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding transport data:', error);
    process.exit(1);
  }
};

seedTransport();
