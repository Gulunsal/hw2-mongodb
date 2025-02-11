const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { generateTokens } = require('../helpers/jwt');
const validateBody = require('../middlewares/validateBody');
const { registerSchema, loginSchema } = require('../schemas/auth');
const authService = require('../services/auth');
const authenticate = require('../middlewares/authenticate');
const ctrlWrapper = require('../utils/ctrlWrapper');

// Auth routes
router.post('/register', validateBody(registerSchema), async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        status: 409,
        message: "Email in use"
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    res.status(201).json({
      status: 201,
      message: "Successfully registered a user!",
      data: {
        name: user.name,
        email: user.email,
        _id: user._id,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    next(error);
  }
});

// Login
router.post('/login', validateBody(loginSchema), async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        status: 401,
        message: "Email or password is wrong"
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        status: 401,
        message: "Email or password is wrong"
      });
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user._id);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });

    res.json({
      status: 200,
      message: "Successfully logged in an user!",
      data: { accessToken }
    });
  } catch (error) {
    next(error);
  }
});

const refresh = async (req, res) => {
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
};

const logout = async (req, res) => {
  const { userId } = req.user;
  await authService.logout(userId);
  
  res.clearCookie('refreshToken');
  res.status(204).send();
};

module.exports = {
  register: router.post('/register'),
  login: router.post('/login'),
  refresh,
  logout
}; 