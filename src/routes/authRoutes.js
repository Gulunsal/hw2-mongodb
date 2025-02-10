const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/authController');
const { validateBody, resetPasswordSchema } = require('../middlewares/validateBody');
const { registerSchema, loginSchema, resetEmailSchema } = require('../schemas/authSchema');
const authenticate = require('../middlewares/authenticate');

// Auth routes
router.post('/register', validateBody(registerSchema), ctrl.register);
router.post('/login', validateBody(loginSchema), ctrl.login);
router.post('/logout', authenticate, ctrl.logout);
router.get('/current', authenticate, ctrl.getCurrent);

// Password reset routes
router.post('/send-reset-email', validateBody(resetEmailSchema), ctrl.sendResetEmail);
router.post('/reset-pwd', validateBody(resetPasswordSchema), ctrl.resetPassword);

module.exports = router;
