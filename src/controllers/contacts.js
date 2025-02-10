const Contact = require('../models/contact');
const createError = require('http-errors');
const { uploadImage } = require('../helpers/cloudinary');

const getAllContacts = async (req, res) => {
  try {
    const { _id: owner } = req.user;
    const contacts = await Contact.find({ owner });
    
    res.json({
      status: "success",
      code: 200,
      data: {
        contacts,
        total: contacts.length
      }
    });
  } catch (error) {
    throw createError(500, "Failed to fetch contacts");
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
      status: "success",
      code: 200,
      data: {
        contact
      }
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      throw createError(400, "Invalid contact ID");
    }
    throw error;
  }
};

const createContact = async (req, res) => {
  try {
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
      status: "success",
      code: 201,
      data: {
        contact
      }
    });
  } catch (error) {
    throw createError(500, "Failed to create contact");
  }
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
      throw createError(404, "Contact not found");
    }

    res.json({
      status: "success",
      code: 200,
      data: {
        contact
      }
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      throw createError(400, "Invalid contact ID");
    }
    throw error;
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

    res.status(200).json({
      status: "success",
      code: 200,
      message: "Contact deleted",
      data: {
        contact
      }
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      throw createError(400, "Invalid contact ID");
    }
    throw error;
  }
};

module.exports = {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact
}; 