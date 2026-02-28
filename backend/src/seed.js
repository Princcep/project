/**
 * Seed script to initialize database with demo data
 * Run: node src/seed.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const config = require('./config');

// Import models
const User = require('./models/User');
const Bridge = require('./models/Bridge');
const BridgeData = require('./models/BridgeData');
const Alert = require('./models/Alert');

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(config.MONGODB_URI);
    console.log('✅ MongoDB connected');

    // Clear existing data
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Bridge.deleteMany({});
    await BridgeData.deleteMany({});
    await Alert.deleteMany({});
    console.log('✅ Cleared existing data');

    // Create demo users
    console.log('Creating demo users...');
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123456',
      role: 'admin',
    });
    console.log('✅ Admin user created:', adminUser.email);

    const demoUser = await User.create({
      name: 'Demo Engineer',
      email: 'demo@example.com',
      password: 'demo123456',
      role: 'engineer',
    });
    console.log('✅ Demo user created:', demoUser.email);

    // Create demo bridges
    console.log('Creating demo bridges...');
    const bridge1 = await Bridge.create({
      name: 'Golden Gate Bridge',
      location: 'San Francisco, CA',
      status: 'operational',
      createdBy: adminUser._id,
    });
    console.log('✅ Bridge 1 created:', bridge1.name);

    const bridge2 = await Bridge.create({
      name: 'Brooklyn Bridge',
      location: 'New York, NY',
      status: 'operational',
      createdBy: adminUser._id,
    });
    console.log('✅ Bridge 2 created:', bridge2.name);

    const bridge3 = await Bridge.create({
      name: 'Tower Bridge',
      location: 'London, UK',
      status: 'operational',
      createdBy: adminUser._id,
    });
    console.log('✅ Bridge 3 created:', bridge3.name);

    // Create sample sensor data for each bridge
    console.log('Creating sample sensor data...');
    const now = new Date();
    for (let i = 0; i < 20; i++) {
      const timestamp = new Date(now.getTime() - i * 5 * 60000); // 5 minutes apart
      
      // Bridge 1 data
      await BridgeData.create({
        bridgeId: bridge1._id,
        vibration: Math.random() * 40 + 10,
        load: Math.random() * 50 + 20,
        crack: Math.random() * 5 + 1,
        temperature: Math.random() * 15 + 15,
        riskScore: Math.random() * 50 + 20,
        timestamp,
      });

      // Bridge 2 data
      await BridgeData.create({
        bridgeId: bridge2._id,
        vibration: Math.random() * 50 + 15,
        load: Math.random() * 60 + 15,
        crack: Math.random() * 8 + 0.5,
        temperature: Math.random() * 10 + 18,
        riskScore: Math.random() * 60 + 15,
        timestamp,
      });

      // Bridge 3 data
      await BridgeData.create({
        bridgeId: bridge3._id,
        vibration: Math.random() * 35 + 12,
        load: Math.random() * 40 + 25,
        crack: Math.random() * 4 + 1.5,
        temperature: Math.random() * 12 + 16,
        riskScore: Math.random() * 45 + 25,
        timestamp,
      });
    }
    console.log('✅ Sample sensor data created');

    // Create sample alerts
    console.log('Creating sample alerts...');
    await Alert.create({
      bridgeId: bridge1._id,
      type: 'risk',
      severity: 'high',
      message: 'Elevated vibration levels detected',
      value: 75.5,
      riskScore: 75.5,
      resolved: false,
    });

    await Alert.create({
      bridgeId: bridge2._id,
      type: 'crack',
      severity: 'medium',
      message: 'Crack width increase detected',
      value: 2.3,
      riskScore: 0,
      resolved: true,
      resolvedAt: new Date(now.getTime() - 2 * 60 * 60000),
    });
    console.log('✅ Sample alerts created');

    console.log('\n✅ Database seeding completed successfully!');
    console.log('\n📋 Demo Credentials:');
    console.log('  Admin:');
    console.log('    Email: admin@example.com');
    console.log('    Password: admin123456');
    console.log('  Engineer:');
    console.log('    Email: demo@example.com');
    console.log('    Password: demo123456');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    process.exit(1);
  }
};

// Run seed
seedDatabase();
