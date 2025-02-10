const createError = require('http-errors');
const Contact = require('../models/contact');
const { uploadImage } = require('../helpers/cloudinaryHelper');

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
    console.error('Get contacts error:', error);
    res.status(500).json({
      status: 500,
      message: error.message,
      data: {}
    });
  }
};

const getContactById = async (req, res) => {
  try {
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
  } catch (error) {
    console.error('Get contact error:', error);
    res.status(500).json({
      status: 500,
      message: error.message,
      data: {}
    });
  }
};

const createContact = async (req, res) => {
  const { _id: owner } = req.user;
  let photo = null;

  if (req.file) {
    photo = await uploadImage(req.file.path);
  }

  const contact = await Contact.create({
    ...req.body,
    owner,
    photo
  });

  res.status(201).json({
    status: 201,
    message: "Contact created successfully",
    data: {
      contact
    }
  });
};

const updateContact = async (req, res) => {
  try {
    const { contactId } = req.params;
    const { _id: owner } = req.user;
    let updateData = { ...req.body };

    if (req.file) {
      updateData.photo = await uploadImage(req.file.path);
    }

    const contact = await Contact.findOneAndUpdate(
      { _id: contactId, owner },
      updateData,
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
  } catch (error) {
    console.error('Update contact error:', error);
    res.status(500).json({
      status: 500,
      message: error.message,
      data: {}
    });
  }
};

const deleteContact = async (req, res) => {
  try {
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
  } catch (error) {
    console.error('Delete contact error:', error);
    res.status(500).json({
      status: 500,
      message: error.message,
      data: {}
    });
  }
};

module.exports = {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact
};
