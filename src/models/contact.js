const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const Joi = require('joi');

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
  },
  phoneNumber: {
    type: String,
    required: [true, 'Phone number is required'],
  },
  photo: {
    type: String,
    default: null,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }
}, { versionKey: false, timestamps: true });

contactSchema.plugin(mongoosePaginate);

const Contact = mongoose.model('Contact', contactSchema);

// Validation şemaları
const schemas = {
  createContactSchema: Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required()  // phoneNumber yerine phone
  }),
  
  updateContactSchema: Joi.object({
    name: Joi.string(),
    email: Joi.string().email(),
    phone: Joi.string()  // phoneNumber yerine phone
  })
};

module.exports = {
  Contact,
  schemas
}; 