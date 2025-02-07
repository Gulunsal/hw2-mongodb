const Contact = require('../models/contact');

const getAllContacts = async () => {
  return await Contact.find();
};

const getContactById = async (contactId) => {
  return await Contact.findById(contactId);
};

const createContact = async (contactData) => {
  return await Contact.create(contactData);
};

const updateContact = async (contactId, updateData) => {
  return await Contact.findByIdAndUpdate(
    contactId,
    updateData,
    { new: true }
  );
};

const deleteContact = async (contactId) => {
  return await Contact.findByIdAndDelete(contactId);
};

module.exports = {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact
}; 