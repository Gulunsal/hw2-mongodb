const createError = require('http-errors');
const contactsService = require('../services/contacts');

const getAllContacts = async (req, res) => {
  const contacts = await contactsService.getAllContacts();
  res.json({
    status: 200,
    message: "Başarıyla tüm kişiler getirildi",
    data: contacts
  });
};

const getContactById = async (req, res) => {
  const contact = await contactsService.getContactById(req.params.contactId);
  if (!contact) {
    throw createError(404, "Kişi bulunamadı");
  }
  res.json({
    status: 200,
    message: "Kişi başarıyla getirildi",
    data: contact
  });
};

const createContact = async (req, res) => {
  const newContact = await contactsService.createContact(req.body);
  res.status(201).json({
    status: 201,
    message: "Kişi başarıyla oluşturuldu!",
    data: newContact
  });
};

const updateContact = async (req, res) => {
  const updatedContact = await contactsService.updateContact(req.params.contactId, req.body);
  if (!updatedContact) {
    throw createError(404, "Kişi bulunamadı");
  }
  res.json({
    status: 200,
    message: "Kişi başarıyla güncellendi!",
    data: updatedContact
  });
};

const deleteContact = async (req, res) => {
  const result = await contactsService.deleteContact(req.params.contactId);
  if (!result) {
    throw createError(404, "Kişi bulunamadı");
  }
  res.status(204).send();
};

module.exports = {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact
}; 