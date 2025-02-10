const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/contactsController');
const validateBody = require('../middlewares/validateBody');
const { schemas } = require('../models/contact');
const isValidId = require('../middlewares/isValidId');
const upload = require('../middlewares/upload');

router.get('/', ctrl.getAllContacts);
router.get('/:contactId', isValidId, ctrl.getContactById);
router.post('/', upload.single('photo'), validateBody(schemas.createContactSchema), ctrl.createContact);
router.patch('/:contactId', isValidId, upload.single('photo'), validateBody(schemas.updateContactSchema), ctrl.updateContact);
router.delete('/:contactId', isValidId, ctrl.deleteContact);

module.exports = router; 