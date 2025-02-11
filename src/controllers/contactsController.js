const createError = require('http-errors');
const { Contact } = require('../models/contact');
const { uploadImage } = require('../helpers/cloudinaryHelper');
const fs = require('fs').promises;

const getAllContacts = async (req, res) => {
  const { _id: owner } = req.user;
  const contacts = await Contact.find({ owner });
  
  res.json({
    status: 200,
    message: "Success",
    data: {
      contacts,
      total: contacts.length
    }
  });
};

const getContactById = async (req, res) => {
  const { contactId } = req.params;
  const { _id: owner } = req.user;
  
  const contact = await Contact.findOne({ _id: contactId, owner });
  if (!contact) {
    return res.status(404).json({
      status: 404,
      message: "Contact not found",
      data: {}
    });
  }
  
  res.json({
    status: 200,
    message: "Success",
    data: { contact }
  });
};

const createContact = async (req, res) => {
  const { _id: owner } = req.user;
  let photoUrl = null;

  if (req.file) {
    photoUrl = await uploadImage(req.file.path);
    await fs.unlink(req.file.path);
  }

  const contact = await Contact.create({ 
    ...req.body, 
    owner,
    photo: photoUrl 
  });
  
  res.status(201).json({
    status: 201,
    message: "Contact created successfully",
    data: { contact }
  });
};

const updateContact = async (req, res) => {
  const { contactId } = req.params;
  const { _id: owner } = req.user;
  let photoUrl = undefined;

  if (req.file) {
    photoUrl = await uploadImage(req.file.path);
    await fs.unlink(req.file.path);
  }

  const contact = await Contact.findOneAndUpdate(
    { _id: contactId, owner },
    { ...req.body, ...(photoUrl && { photo: photoUrl }) },
    { new: true }
  );

  if (!contact) {
    return res.status(404).json({
      status: 404,
      message: "Contact not found",
      data: {}
    });
  }

  res.json({
    status: 200,
    message: "Contact updated successfully",
    data: { contact }
  });
};

const deleteContact = async (req, res) => {
  const { contactId } = req.params;
  const { _id: owner } = req.user;
  
  const contact = await Contact.findOneAndDelete({ _id: contactId, owner });
  if (!contact) {
    return res.status(404).json({
      status: 404,
      message: "Contact not found",
      data: {}
    });
  }

  res.json({
    status: 200,
    message: "Contact deleted successfully",
    data: { contact }
  });
};

module.exports = {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact
};
