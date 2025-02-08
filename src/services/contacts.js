const Contact = require('../models/contact');
const createError = require('http-errors');

const getAllContacts = async (userId, query) => {
  const {
    page = 1,
    perPage = 10,
    sortBy = "name",
    sortOrder = "asc",
    type,
    isFavourite
  } = query;

  // Filtreleme seçenekleri
  const filter = { userId };
  if (type) filter.contactType = type;
  if (isFavourite !== undefined) filter.isFavourite = isFavourite;

  // Sıralama seçenekleri
  const sort = {
    [sortBy]: sortOrder === "asc" ? 1 : -1
  };

  // Sayfalama ve sonuçları getir
  const options = {
    page: parseInt(page),
    limit: parseInt(perPage),
    sort
  };

  const result = await Contact.paginate(filter, options);

  return {
    data: result.docs,
    page: result.page,
    perPage: result.limit,
    totalItems: result.totalDocs,
    totalPages: result.totalPages,
    hasPreviousPage: result.hasPrevPage,
    hasNextPage: result.hasNextPage
  };
};

const getContactById = async (userId, contactId) => {
  const contact = await Contact.findOne({ _id: contactId, userId });
  if (!contact) {
    throw createError(404, "Contact not found");
  }
  return contact;
};

const createContact = async (userId, contactData) => {
  return await Contact.create({ ...contactData, userId });
};

const updateContact = async (userId, contactId, updateData) => {
  const contact = await Contact.findOneAndUpdate(
    { _id: contactId, userId },
    updateData,
    { new: true }
  );
  if (!contact) {
    throw createError(404, "Contact not found");
  }
  return contact;
};

const deleteContact = async (userId, contactId) => {
  const contact = await Contact.findOneAndDelete({ _id: contactId, userId });
  if (!contact) {
    throw createError(404, "Contact not found");
  }
  return contact;
};

module.exports = {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact
}; 