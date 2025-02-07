const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'İsim alani zorunludur'],
    minlength: 3,
    maxlength: 20
  },
  phoneNumber: {
    type: String,
    required: [true, 'Telefon numarasi zorunludur']
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

contactSchema.plugin(mongoosePaginate);

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact; 