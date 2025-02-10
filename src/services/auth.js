const bcrypt = require('bcryptjs');
const createError = require('http-errors');
const User = require('../models/user');
const Session = require('../models/session');
const { generateTokens } = require('../helpers/jwt');

const register = async (userData) => {
  const { email } = userData;
  
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw createError(409, 'Email in use');
  }

  const user = await User.create(userData);
  return user;
};

const login = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    throw createError(401, 'Email or password is wrong');
  }

  // Eski oturumu sil
  await Session.deleteMany({ userId: user._id });

  // Yeni tokenlar oluştur
  const tokens = generateTokens(user._id);

  // Yeni oturum oluştur
  await Session.create({
    userId: user._id,
    ...tokens
  });

  return tokens;
};

const refresh = async (userId, refreshToken) => {
  const session = await Session.findOne({ 
    userId,
    refreshToken,
    refreshTokenValidUntil: { $gt: new Date() }
  });

  if (!session) {
    throw createError(401, 'Invalid refresh token');
  }

  // Eski oturumu sil
  await Session.deleteMany({ userId });

  // Yeni tokenlar oluştur
  const tokens = generateTokens(userId);

  // Yeni oturum oluştur
  await Session.create({
    userId,
    ...tokens
  });

  return tokens;
};

const logout = async (userId) => {
  await Session.deleteMany({ userId });
};

module.exports = {
  register,
  login,
  refresh,
  logout
}; 