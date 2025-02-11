const { Schema, model } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const Joi = require('joi');

const contactSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Set name for contact'],
  },
  email: {
    type: String,
    required: [true, 'Set email for contact'],
  },
  phoneNumber: {
    type: String,
    required: [true, 'Set phone number for contact'],
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }
}, { versionKey: false, timestamps: true });

contactSchema.plugin(mongoosePaginate);

const Contact = model('Contact', contactSchema);

// Validation şemaları
const schemas = {
  createContactSchema: Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required()  
  }),
  
  updateContactSchema: Joi.object({
    name: Joi.string(),
    email: Joi.string().email(),
    phone: Joi.string() 
  })
};

module.exports = {
  Contact,
  schemas
}; 