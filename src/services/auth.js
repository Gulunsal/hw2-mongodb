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
  
  const { password, ...userWithoutPassword } = user.toObject();
  return userWithoutPassword;
};

const login = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw createError(401, 'Email or password is wrong');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw createError(401, 'Email or password is wrong');
  }

  // Eski oturumu sil
  await Session.deleteMany({ userId: user._id });

  // Yeni token'lar oluştur
  const tokens = generateTokens(user._id);

  // Yeni oturum oluştur
  await Session.create({
    userId: user._id,
    ...tokens
  });

  return tokens;
};

const refresh = async (userId, oldRefreshToken) => {
  const session = await Session.findOne({ 
    userId, 
    refreshToken: oldRefreshToken,
    refreshTokenValidUntil: { $gt: new Date() }
  });

  if (!session) {
    throw createError(401, 'Invalid refresh token');
  }

  // Eski oturumu sil
  await Session.deleteMany({ userId });

  // Yeni token'lar oluştur
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