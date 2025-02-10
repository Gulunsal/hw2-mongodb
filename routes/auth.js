const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/auth');
const { validateBody } = require('../middlewares/validateBody');
const { registerSchema, loginSchema, resetEmailSchema, resetPasswordSchema } = require('../schemas/auth');

router.post('/register', validateBody(registerSchema), ctrl.register);
router.post('/login', validateBody(loginSchema), ctrl.login);
router.post('/send-reset-email', validateBody(resetEmailSchema), ctrl.sendResetEmail);
router.post('/reset-pwd', validateBody(resetPasswordSchema), ctrl.resetPassword);
router.get('/current', authenticate, ctrl.getCurrent);
router.post('/logout', authenticate, ctrl.logout);

module.exports = router; 