const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const path = require('path');

// Routes
const authRoutes = require('./routes/authRoutes');
const contactsRoutes = require('./routes/contactsRoutes');

// Error handler
const errorHandler = require('./middlewares/errorHandler');

dotenv.config();
const app = express();

// Tmp klasörünü oluştur
const tmpDir = path.join(__dirname, '../tmp');
if (!fs.existsSync(tmpDir)) {
  fs.mkdirSync(tmpDir);
}

// Detailed error logging
const logError = (err) => {
  console.error('Error details:', {
    message: err.message,
    stack: err.stack,
    code: err.code
  });
};

// Middleware setup
app.use(logger('dev'));
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Routes
app.get('/api/health', (req, res) => {
  res.json({
    status: 200,
    message: "Server is running",
    data: {
      timestamp: new Date(),
      environment: process.env.NODE_ENV || 'development',
      dbStatus: mongoose.connection.readyState
    }
  });
});

app.use('/auth', authRoutes);
app.use('/contacts', contactsRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: 404,
    message: 'Not Found',
    data: {}
  });
});

// Enhanced error handler
app.use((err, req, res, next) => {
  logError(err);
  
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  res.status(status).json({
    status,
    message,
    data: {},
    error: process.env.NODE_ENV === 'development' ? {
      stack: err.stack,
      code: err.code
    } : undefined
  });
});

// Database connection with retry logic
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_HOST, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('Database connection successful');
  } catch (error) {
    console.error('Database connection error:', error);
    // Retry after 5 seconds
    setTimeout(connectDB, 5000);
  }
};

// Start server only after DB connection
const startServer = async () => {
  try {
    await connectDB();
    
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log('Environment:', process.env.NODE_ENV);
      console.log('Database status:', mongoose.connection.readyState);
    });
  } catch (error) {
    console.error('Server startup error:', error);
    process.exit(1);
  }
};

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
  process.exit(1);
});

// Start the server
startServer();
