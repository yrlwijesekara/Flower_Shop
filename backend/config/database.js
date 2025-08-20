const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Set mongoose options for better performance
    const options = {
      // Set timeout for initial connection
      serverSelectionTimeoutMS: 5000,
      // Set timeout for socket operations
      socketTimeoutMS: 45000,
      // Buffer commands until connection is established
      bufferCommands: false,
      // Maximum time for retry attempts
      maxPoolSize: 10,
      // Close connections after 30 seconds of inactivity
      maxIdleTimeMS: 30000
    };

    const conn = await mongoose.connect(process.env.MONGO_URI, options);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold);
    
    // Log database name
    console.log(`📂 Database: ${conn.connection.name}`.green);
    
    // Handle connection events
    mongoose.connection.on('connected', () => {
      console.log('📡 Mongoose connected to MongoDB'.green);
    });

    mongoose.connection.on('error', (err) => {
      console.log(`❌ Mongoose connection error: ${err}`.red);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('📴 Mongoose disconnected from MongoDB'.yellow);
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      try {
        await mongoose.connection.close();
        console.log('📴 MongoDB connection closed through app termination'.yellow);
        process.exit(0);
      } catch (error) {
        console.log(`❌ Error closing MongoDB connection: ${error}`.red);
        process.exit(1);
      }
    });

  } catch (error) {
    console.error(`❌ Database connection failed: ${error.message}`.red.underline.bold);
    console.log(`⚠️  Server will continue with sample data for development`.yellow.bold);
    // Don't exit the process, let the server run with sample data
    // process.exit(1);
  }
};

module.exports = connectDB;