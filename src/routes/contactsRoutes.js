const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/contactsController');
const { validateBody } = require('../middlewares/validateBody');
const { createContactSchema, updateContactSchema } = require('../schemas/contactSchema');
const upload = require('../middlewares/upload');
const authenticate = require('../middlewares/authenticate');

// Tüm rotaları authenticate ile koruyoruz
router.use(authenticate);

// Contact routes
router.get('/', ctrl.getAllContacts);
router.get('/:contactId', ctrl.getContactById);
router.post('/', upload.single('photo'), validateBody(createContactSchema), ctrl.createContact);
router.patch('/:contactId', upload.single('photo'), validateBody(updateContactSchema), ctrl.updateContact);
router.delete('/:contactId', ctrl.deleteContact);

module.exports = router;