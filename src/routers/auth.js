const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/auth');
const validateBody = require('../middlewares/validateBody');
const authenticate = require('../middlewares/authenticate');
const { registerSchema, loginSchema, resetEmailSchema, resetPasswordSchema } = require('../schemas/auth');
const ctrlWrapper = require('../utils/ctrlWrapper');
const User = require('../models/user');
const Session = require('../models/session');

router.post('/register', validateBody(registerSchema), ctrlWrapper(ctrl.register));
router.post('/login', validateBody(loginSchema), ctrlWrapper(ctrl.login));
router.post('/refresh', authenticate, ctrlWrapper(ctrl.refresh));
router.post('/logout', authenticate, ctrlWrapper(ctrl.logout));
router.get('/users', ctrlWrapper(ctrl.getAllUsers));

module.exports = router; 