const express = require('express');
const router = express.Router();
const Contact = require('../models/contact');
const validateBody = require('../middlewares/validateBody');
const { createContactSchema, updateContactSchema } = require('../schemas/contact');
const isValidId = require('../middlewares/isValidId');

// Get all contacts
router.get('/', async (req, res, next) => {
  try {
    const { _id: owner } = req.user;
    const contacts = await Contact.find({ owner }).sort({ createdAt: -1 });
    
    res.json({
      status: 200,
      message: "Success",
      data: {
        contacts,
        total: contacts.length
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get contact by ID
router.get('/:contactId', isValidId, async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const { _id: owner } = req.user;
    
    const contact = await Contact.findOne({ _id: contactId, owner });
    if (!contact) {
      return res.status(404).json({
        status: 404,
        message: "Contact not found"
      });
    }
    
    res.json({
      status: 200,
      message: "Success",
      data: { contact }
    });
  } catch (error) {
    next(error);
  }
});

// Create contact
router.post('/', validateBody(createContactSchema), async (req, res, next) => {
  try {
    const contact = await Contact.create({
      ...req.body,
      owner: req.user._id
    });
    
    res.status(201).json({
      status: 201,
      message: "Contact created successfully",
      data: { contact }
    });
  } catch (error) {
    next(error);
  }
});

// Update contact
router.patch('/:contactId', isValidId, validateBody(updateContactSchema), async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const { _id: owner } = req.user;

    const contact = await Contact.findOneAndUpdate(
      { _id: contactId, owner },
      req.body,
      { new: true }
    );

    if (!contact) {
      return res.status(404).json({
        status: 404,
        message: "Contact not found"
      });
    }

    res.json({
      status: 200,
      message: "Contact updated successfully",
      data: { contact }
    });
  } catch (error) {
    next(error);
  }
});

// Delete contact
router.delete('/:contactId', isValidId, async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const { _id: owner } = req.user;
    
    const contact = await Contact.findOneAndDelete({ _id: contactId, owner });
    if (!contact) {
      return res.status(404).json({
        status: 404,
        message: "Contact not found"
      });
    }

    res.json({
      status: 200,
      message: "Contact deleted successfully",
      data: { contact }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
