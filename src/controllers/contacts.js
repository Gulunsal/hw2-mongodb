const createError = require('http-errors');
const contactsService = require('../services/contacts');

const getAllContacts = async (req, res) => {
  const contacts = await contactsService.getAllContacts(req.user._id, req.query);
  res.json({
    status: 200,
    message: "Successfully found contacts!",
    data: contacts
  });
};

const getContactById = async (req, res) => {
  const { contactId } = req.params;
  const contact = await contactsService.getContactById(req.user._id, contactId);
  if (!contact) {
    throw createError(404, "Contact not found");
  }
  res.json({
    status: 200,
    message: "Successfully found the contact!",
    data: contact
  });
};

const createContact = async (req, res) => {
  const contact = await contactsService.createContact(req.user._id, req.body);
  res.status(201).json({
    status: 201,
    message: "Successfully created a contact!",
    data: contact
  });
};

const updateContact = async (req, res) => {
  const { contactId } = req.params;
  const contact = await contactsService.updateContact(req.user._id, contactId, req.body);
  if (!contact) {
    throw createError(404, "Contact not found");
  }
  res.json({
    status: 200,
    message: "Successfully patched a contact!",
    data: contact
  });
};

const deleteContact = async (req, res) => {
  const { contactId } = req.params;
  await contactsService.deleteContact(req.user._id, contactId);
  res.status(204).send();
};

module.exports = {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact
}; 