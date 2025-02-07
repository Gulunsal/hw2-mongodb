const Contact = require('../models/contact');

const getAllContacts = async (query) => {
  const {
    page = 1,
    perPage = 10,
    sortBy = "name",
    sortOrder = "asc",
    type,
    isFavourite
  } = query;

  // Filtreleme seçenekleri
  const filter = {};
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