const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/contacts');
const { validateBody } = require('../middlewares/validateBody');
const { createContactSchema, updateContactSchema } = require('../schemas/contact');
const authenticate = require('../middlewares/authenticate');
const upload = require('../middlewares/upload');

// Tüm rotaları authenticate middleware'i ile koruyalım
router.use(authenticate);

router.get('/', ctrl.getAllContacts);
router.get('/:contactId', ctrl.getContactById);
router.post('/', upload.single('photo'), validateBody(createContactSchema), ctrl.createContact);
router.patch('/:contactId', upload.single('photo'), validateBody(updateContactSchema), ctrl.updateContact);
router.delete('/:contactId', ctrl.deleteContact);

module.exports = router; 