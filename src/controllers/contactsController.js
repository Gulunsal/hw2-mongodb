const Contact = require('../models/contact');
const createError = require('http-errors');

const getAllContacts = async (req, res) => {
  try {
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
  } catch (error) {
    throw createError(500, error.message);
  }
};

const getContactById = async (req, res) => {
  try {
    const { contactId } = req.params;
    const { _id: owner } = req.user;
    
    const contact = await Contact.findOne({ _id: contactId, owner });
    if (!contact) {
      throw createError(404, "Contact not found");
    }
    
    res.json({
      status: 200,
      message: "Success",
      data: { contact }
    });
  } catch (error) {
    throw createError(error.status || 500, error.message);
  }
};

const createContact = async (req, res) => {
  try {
    const { _id: owner } = req.user;
    const newContact = {
      ...req.body,
      owner
    };

    const contact = new Contact(newContact);
    await contact.save();
    
    res.status(201).json({
      status: 201,
      message: "Contact created successfully",
      data: { contact }
    });
  } catch (error) {
    throw createError(500, error.message);
  }
};

const updateContact = async (req, res) => {
  try {
    const { contactId } = req.params;
    const { _id: owner } = req.user;

    const contact = await Contact.findOneAndUpdate(
      { _id: contactId, owner },
      req.body,
      { new: true }
    );

    if (!contact) {
      throw createError(404, "Contact not found");
    }

    res.json({
      status: 200,
      message: "Contact updated successfully",
      data: { contact }
    });
  } catch (error) {
    throw createError(error.status || 500, error.message);
  }
};

const deleteContact = async (req, res) => {
  try {
    const { contactId } = req.params;
    const { _id: owner } = req.user;
    
    const contact = await Contact.findOneAndDelete({ _id: contactId, owner });
    if (!contact) {
      throw createError(404, "Contact not found");
    }

    res.json({
      status: 200,
      message: "Contact deleted successfully",
      data: { contact }
    });
  } catch (error) {
    throw createError(error.status || 500, error.message);
  }
};

module.exports = {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact
};
