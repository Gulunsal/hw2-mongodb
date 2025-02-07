const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const contactsRouter = require('./routers/contacts');
const errorHandler = require('./middlewares/errorHandler');
const notFoundHandler = require('./middlewares/notFoundHandler');

dotenv.config();

const app = express();
const { PORT = 3000, DB_HOST } = process.env;

app.use(express.json());
app.use('/contacts', contactsRouter);
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
