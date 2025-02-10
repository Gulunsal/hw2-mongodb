const createError = require('http-errors');
const Contact = require('../models/contact');
const { uploadImage } = require('../helpers/cloudinaryHelper');

const getAllContacts = async (req, res) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 20 } = req.query;
  
  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    populate: {
      path: 'owner',
      select: 'email subscription -_id'
    }
  };

  const result = await Contact.paginate({ owner }, options);

  res.json({
    status: 200,
    message: "Success",
    data: {
      contacts: result.docs,
      totalPages: result.totalPages,
      currentPage: result.page,
      totalContacts: result.totalDocs
    }
  });
};

const getContactById = async (req, res) => {
  const { contactId } = req.params;
  const { _id: owner } = req.user;

  const contact = await Contact.findOne({ _id: contactId, owner });
  if (!contact) {
    throw createError(404, "Contact not found");
  }

  res.json({
    status: 200,
    message: "Success",
    data: {
      contact
    }
  });
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
    status: 200,
    message: "Contact updated successfully",
    data: {
      contact
    }
  });
};

const deleteContact = async (req, res) => {
  const { contactId } = req.params;
  const { _id: owner } = req.user;

  const contact = await Contact.findOneAndDelete({ _id: contactId, owner });
  if (!contact) {
    throw createError(404, "Contact not found");
  }

  res.json({
    status: 200,
    message: "Contact deleted successfully",
    data: {
      contact
    }
  });
};

module.exports = {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact
};
