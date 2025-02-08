const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    minlength: 3,
    maxlength: 20
  },
  phoneNumber: {
    type: String,
    required: [true, 'Phone number is required']
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
    required: [true, 'Contact type is required']
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { versionKey: false, timestamps: true });

contactSchema.plugin(mongoosePaginate);

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact; 