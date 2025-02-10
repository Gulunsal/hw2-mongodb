const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

async function testConnection() {
  try {
    console.log('Attempting to connect to MongoDB...');
    console.log('DB_HOST:', process.env.DB_HOST);
    
    await mongoose.connect(process.env.DB_HOST, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    
    console.log('Successfully connected to MongoDB!');
    
    // Test creating a simple document
    const TestModel = mongoose.model('Test', new mongoose.Schema({
      name: String,
      timestamp: { type: Date, default: Date.now }
    }));
    
    const testDoc = await TestModel.create({ name: 'test' });
    console.log('Successfully created test document:', testDoc);
    
    await mongoose.connection.close();
    console.log('Connection closed successfully');
    
  } catch (error) {
    console.error('Connection test failed:', error);
  } finally {
    process.exit();
  }
}

testConnection(); 