const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    if (!process.env.DB_HOST) {
      throw new Error('DB_HOST is not defined in environment variables');
    }
    
    const conn = await mongoose.connect(process.env.DB_HOST, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('Veritabanı bağlantısı başarılı');
    return conn;
  } catch (error) {
    console.error('Veritabanı bağlantı hatası:', error);
    process.exit(1);
  }
};

module.exports = connectDB; 