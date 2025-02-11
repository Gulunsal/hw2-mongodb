const express = require('express');
const router = express.Router();
const authService = require('../services/auth');
const validateBody = require('../middlewares/validateBody');
const { schemas } = require('../models/user');
const authenticate = require('../middlewares/authenticate');
const ctrlWrapper = require('../utils/ctrlWrapper');

// Auth routes
router.post('/register', validateBody(schemas.registerSchema), async (req, res) => {
  const user = await authService.register(req.body);
  res.status(201).json({
    status: 201,
    message: "Successfully registered a user!",
    data: user
  });
});

router.post('/login', validateBody(schemas.loginSchema), async (req, res) => {
  const { email, password } = req.body;
  const { accessToken, refreshToken } = await authService.login(email, password);

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    maxAge: 30 * 24 * 60 * 60 * 1000 // 30 gün
  });

  res.json({
    status: 200,
    message: "Successfully logged in an user!",
    data: { accessToken }
  });
});

router.post('/refresh', authenticate, async (req, res) => {
  const { refreshToken } = req.cookies;
  const { userId } = req.user;

  const tokens = await authService.refresh(userId, refreshToken);

  res.cookie('refreshToken', tokens.refreshToken, {
    httpOnly: true,
    maxAge: 30 * 24 * 60 * 60 * 1000 // 30 gün
  });

  res.json({
    status: 200,
    message: "Successfully refreshed a session!",
    data: { accessToken: tokens.accessToken }
  });
});

router.post('/logout', authenticate, async (req, res) => {
  const { userId } = req.user;
  await authService.logout(userId);
  
  res.clearCookie('refreshToken');
  res.status(204).send();
});

module.exports = router; 