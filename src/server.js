const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const contactsRouter = require('./routers/contacts');
const authRouter = require('./routers/auth');
const authenticate = require('./middlewares/authenticate');
const errorHandler = require('./middlewares/errorHandler');
const notFoundHandler = require('./middlewares/notFoundHandler');

dotenv.config();

const app = express();
const { PORT = 3000, DB_HOST } = process.env;

app.use(logger('dev'));
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Ana sayfa için karşılama mesajı
app.get('/', (req, res) => {
  res.json({
    status: 200,
    message: "Welcome to Contacts API! Use /contacts endpoint with authentication to access the API."
  });
});

app.use('/auth', authRouter);
app.use('/contacts', authenticate, contactsRouter);
app.use(notFoundHandler);
app.use(errorHandler);

mongoose.connect(DB_HOST)
  .then(() => {
    console.log('Veritabanı bağlantısı başarılı');
    app.listen(PORT, () => {
      console.log(`Server ${PORT} portunda çalışıyor`);
    });
  })
  .catch(error => {
    console.error('Veritabanı bağlantı hatası:', error);
    process.exit(1);
  });

// ... mevcut kod ...
