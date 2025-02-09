const authService = require('../services/auth');
const sendEmail = require('../helpers/sendEmail');
const { generateTokens, verifyToken } = require('../helpers/jwt');
const User = require('../models/user');
const Session = require('../models/session');
const createError = require('http-errors');

const register = async (req, res) => {
  const user = await authService.register(req.body);
  res.status(201).json({
    status: 201,
    message: "Successfully registered a user!",
    data: user
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const { accessToken, refreshToken } = await authService.login(email, password);

  // Refresh token'ı cookie olarak ayarla
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    maxAge: 30 * 24 * 60 * 60 * 1000 // 30 gün
  });

  res.json({
    status: 200,
    message: "Successfully logged in an user!",
    data: { accessToken }
  });
};

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

const getAllUsers = async (req, res) => {
  const users = await User.find();
  res.json({
    status: 200,
    message: "Successfully retrieved users!",
    data: users
  });
};

const sendResetEmail = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  
  if (!user) {
    return res.status(404).json({ message: "User not found!" });
  }

  // Token oluşturma ve e-posta gönderme işlemleri burada
  res.status(200).json({ message: "Reset email sent!" });
};

module.exports = {
  register,
  login,
  refresh,
  logout,
  getAllUsers
}; 