const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Route imports
const contactsRouter = require('./routes/contacts');
const authRouter = require('./routes/auth');

// Middleware imports
const authenticate = require('./middlewares/authenticate');
const errorHandler = require('./middlewares/errorHandler');
const notFoundHandler = require('./middlewares/notFoundHandler');

dotenv.config();

const app = express();
const { DB_HOST } = process.env;
const PORT = process.env.PORT || 10000;

// Middleware setup
app.use(logger('dev'));
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/auth', authRouter);
app.use('/contacts', authenticate, contactsRouter);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Database connection and server start
mongoose.connect(DB_HOST)
  .then(() => {
    console.log('Veritabanı bağlantısı başarılı');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(error => {
    console.error('Veritabanı bağlantı hatası:', error);
    process.exit(1);
  });
