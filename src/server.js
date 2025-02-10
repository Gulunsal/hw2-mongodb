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

// Routes
app.get('/api/health', (req, res) => {
  res.json({
    status: 200,
    message: "Server is running",
    dbStatus: mongoose.connection.readyState
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

// Simple error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message });
});

// Connect to MongoDB and start server
mongoose.connect(process.env.DB_HOST)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });
