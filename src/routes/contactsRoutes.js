const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/contactsController');
const authenticate = require('../middlewares/authenticate');
const upload = require('../middlewares/upload');

// Tüm rotaları authenticate ile koruyoruz
router.use(authenticate);

// Contact routes
router.get('/', ctrl.getAllContacts);
router.get('/:contactId', ctrl.getContactById);
router.post('/', upload.single('photo'), ctrl.createContact);
router.patch('/:contactId', upload.single('photo'), ctrl.updateContact);
router.delete('/:contactId', ctrl.deleteContact);

module.exports = router;