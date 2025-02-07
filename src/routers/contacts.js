const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/contacts');
const { validateBody } = require('../middlewares/validateBody');
const { isValidId } = require('../middlewares/isValidId');
const { createContactSchema, updateContactSchema } = require('../schemas/contact');
const ctrlWrapper = require('../utils/ctrlWrapper');

router.get('/', ctrlWrapper(ctrl.getAllContacts));
router.get('/:contactId', isValidId, ctrlWrapper(ctrl.getContactById));
router.post('/', validateBody(createContactSchema), ctrlWrapper(ctrl.createContact));
router.patch('/:contactId', isValidId, validateBody(updateContactSchema), ctrlWrapper(ctrl.updateContact));
router.delete('/:contactId', isValidId, ctrlWrapper(ctrl.deleteContact));

module.exports = router; 