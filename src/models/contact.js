const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'İsim alanı zorunludur']
  },
  phoneNumber: {
    type: String,
    required: [true, 'Telefon numarası zorunludur']
  },
  email: {
    type: String,
    required: false
  },
  isFavourite: {
    type: Boolean,
    default: false
  },
  contactType: {
    type: String,
    required: [true, 'Kişi tipi zorunludur']
  }
}, { versionKey: false, timestamps: true });

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact; 