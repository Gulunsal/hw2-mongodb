const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/auth');
const validateBody = require('../middlewares/validateBody');
const authenticate = require('../middlewares/authenticate');
const { registerSchema, loginSchema, resetEmailSchema, resetPasswordSchema } = require('../schemas/auth');
const ctrlWrapper = require('../utils/ctrlWrapper');

router.post('/register', validateBody(registerSchema), ctrlWrapper(ctrl.register));
router.post('/login', validateBody(loginSchema), ctrlWrapper(ctrl.login));
router.post('/refresh', authenticate, ctrlWrapper(ctrl.refresh));
router.post('/logout', authenticate, ctrlWrapper(ctrl.logout));
router.post('/send-reset-email', validateBody(resetEmailSchema), ctrlWrapper(ctrl.sendResetEmail));
router.post('/reset-pwd', validateBody(resetPasswordSchema), ctrlWrapper(ctrl.resetPassword));

module.exports = router; 