const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required']
  },
  email: {
    type: String,
    required: [true, 'Email is required']
  },
  phone: {
    type: String,
    required: [true, 'Phone is required']
  },
  photo: {
    type: String,
    default: null
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { versionKey: false, timestamps: true });

contactSchema.plugin(mongoosePaginate);

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact; 