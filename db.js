const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

// Variable to store the MongoDB memory server instance
let mongoServer;

// Function to connect to MongoDB
async function connectDB() {
  try {
    // First try connecting to the configured MongoDB URL from environment variables
    const mongoUrl = process.env.ATLASDB_URL;
    
    if (mongoUrl && mongoUrl.startsWith('mongodb://localhost')) {
      // If using localhost, try to connect to local MongoDB
      try {
        await mongoose.connect(mongoUrl);
        console.log('Connected to local MongoDB');
        return;
      } catch (localError) {
        console.error('Failed to connect to local MongoDB:', localError.message);
        console.log('Falling back to in-memory MongoDB...');
      }
    } else if (mongoUrl) {
      // If using Atlas or other remote MongoDB, try to connect
      try {
        await mongoose.connect(mongoUrl);
        console.log('Connected to MongoDB Atlas');
        return;
      } catch (atlasError) {
        console.error('Failed to connect to MongoDB Atlas:', atlasError.message);
        console.log('Falling back to in-memory MongoDB...');
      }
    }

    // If we reach here, both local and Atlas connections failed or weren't configured
    // Start an in-memory MongoDB server as a fallback
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    
    await mongoose.connect(mongoUri);
    console.log('Connected to in-memory MongoDB');
    console.log('Warning: This is a temporary database that will be lost when the server stops');
    console.log('Use this for development only');
    
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

// Function to close the MongoDB connection
async function closeDB() {
  try {
    await mongoose.connection.close();
    if (mongoServer) {
      await mongoServer.stop();
    }
    console.log('MongoDB connection closed');
  } catch (error) {
    console.error('Error closing MongoDB connection:', error);
  }
}

// Handle application termination
process.on('SIGINT', async () => {
  await closeDB();
  process.exit(0);
});

module.exports = { connectDB, closeDB };