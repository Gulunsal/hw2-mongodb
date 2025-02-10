const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/authController');
const { validateBody } = require('../middlewares/validateBody');
const { schemas } = require('../models/user');
const authenticate = require('../middlewares/authenticate');
const ctrlWrapper = require('../utils/ctrlWrapper');

// Auth routes
router.post('/register', validateBody(schemas.registerSchema), ctrlWrapper(ctrl.register));
router.post('/login', validateBody(schemas.loginSchema), ctrlWrapper(ctrl.login));
router.post('/refresh', authenticate, ctrlWrapper(ctrl.refresh));
router.post('/logout', authenticate, ctrlWrapper(ctrl.logout));

module.exports = router; 