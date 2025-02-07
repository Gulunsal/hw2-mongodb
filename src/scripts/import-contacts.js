const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Contact = require('../models/contact');
const contacts = require('../data/contacts.json');

dotenv.config();

const { DB_HOST } = process.env;

async function importContacts() {
  try {
    await mongoose.connect(DB_HOST);
    console.log('Veritabanı bağlantısı başarılı');

    // Mevcut verileri temizle
    await Contact.deleteMany({});
    console.log('Mevcut veriler temizlendi');

    // Yeni verileri ekle
    const result = await Contact.insertMany(contacts);
    console.log(`${result.length} kişi başarıyla eklendi`);

    mongoose.connection.close();
  } catch (error) {
    console.error('Hata:', error);
    process.exit(1);
  }
}

importContacts(); 