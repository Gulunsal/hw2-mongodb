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
const PORT = process.env.PORT || 10000;

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

// Welcome page HTML
const welcomeHTML = `
<!DOCTYPE html>
<html>
<head>
    <title>Contacts API</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        .endpoint {
            background: #f4f4f4;
            padding: 10px;
            margin: 10px 0;
            border-radius: 5px;
        }
        .method {
            font-weight: bold;
            color: #fff;
            padding: 3px 6px;
            border-radius: 3px;
            margin-right: 5px;
        }
        .get { background: #61affe; }
        .post { background: #49cc90; }
        .patch { background: #fca130; }
        .delete { background: #f93e3e; }
        .path { color: #3b4151; }
        .multipart { color: #800080; font-style: italic; }
    </style>
</head>
<body>
    <h1>🌟 Contacts API</h1>
    
    <h2>👤 Authentication</h2>
    <div class="endpoint">
        <p><span class="method post">POST</span> <span class="path">/auth/register</span></p>
        <p>Register a new user</p>
    </div>
    <div class="endpoint">
        <p><span class="method post">POST</span> <span class="path">/auth/login</span></p>
        <p>Login user</p>
    </div>
    <div class="endpoint">
        <p><span class="method post">POST</span> <span class="path">/auth/logout</span></p>
        <p>Logout user</p>
    </div>
    <div class="endpoint">
        <p><span class="method post">POST</span> <span class="path">/auth/send-reset-email</span></p>
        <p>Send password reset email</p>
    </div>
    <div class="endpoint">
        <p><span class="method post">POST</span> <span class="path">/auth/reset-pwd</span></p>
        <p>Reset password with token</p>
    </div>

    <h2>📝 Contacts</h2>
    <div class="endpoint">
        <p><span class="method get">GET</span> <span class="path">/contacts</span></p>
        <p>Get all contacts</p>
    </div>
    <div class="endpoint">
        <p><span class="method get">GET</span> <span class="path">/contacts/:id</span></p>
        <p>Get contact by ID</p>
    </div>
    <div class="endpoint">
        <p><span class="method post">POST</span> <span class="path">/contacts</span></p>
        <p>Create new contact</p>
        <p><span class="multipart">Supports multipart/form-data for photo upload</span></p>
        <p>Fields:</p>
        <ul>
            <li>name (required)</li>
            <li>email (required)</li>
            <li>phone (required)</li>
            <li>photo (optional) - Image file</li>
        </ul>
    </div>
    <div class="endpoint">
        <p><span class="method patch">PATCH</span> <span class="path">/contacts/:id</span></p>
        <p>Update contact</p>
        <p><span class="multipart">Supports multipart/form-data for photo upload</span></p>
        <p>Fields:</p>
        <ul>
            <li>name (optional)</li>
            <li>email (optional)</li>
            <li>phone (optional)</li>
            <li>photo (optional) - Image file</li>
        </ul>
    </div>
    <div class="endpoint">
        <p><span class="method delete">DELETE</span> <span class="path">/contacts/:id</span></p>
        <p>Delete contact</p>
    </div>

    <h2>🔍 Health Check</h2>
    <div class="endpoint">
        <p><span class="method get">GET</span> <span class="path">/api/health</span></p>
        <p>Check API status</p>
    </div>

    <p style="margin-top: 40px; text-align: center; color: #666;">
        Created by Gulay Duzgun | GoIT FullStack Course - Node.js HW6 
    </p>
</body>
</html>
`;

// Welcome route
app.get('/', (req, res) => {
    res.send(welcomeHTML);
});

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

