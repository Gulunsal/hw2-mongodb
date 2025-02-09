const authService = require('../services/auth');
const sendEmail = require('../helpers/sendEmail');
const { generateTokens, verifyToken } = require('../helpers/jwt');
const { User, Session } = require('../models');
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

const sendResetEmail = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  
  if (!user) {
    throw createError(404, "User not found!");
  }

  const resetToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '5m' });
  const resetLink = `${process.env.APP_DOMAIN}/reset-password?token=${resetToken}`;

  try {
    await sendEmail({
      to: email,
      subject: "Reset Your Password",
      html: `
        <h1>Password Reset Request</h1>
        <p>Please click the link below to reset your password:</p>
        <a href="${resetLink}">Reset Password</a>
        <p>This link will expire in 5 minutes.</p>
      `
    });

    res.json({
      status: 200,
      message: "Reset password email has been successfully sent.",
      data: {}
    });
  } catch (error) {
    throw createError(500, "Failed to send the email, please try again later.");
  }
};

const resetPassword = async (req, res) => {
  const { token, password } = req.body;
  
  let decodedToken;
  try {
    decodedToken = verifyToken(token);
  } catch (error) {
    throw createError(401, "Token is expired or invalid.");
  }

  const user = await User.findOne({ email: decodedToken.email });
  if (!user) {
    throw createError(404, "User not found!");
  }

  // Update password
  user.password = password;
  await user.save();

  // Delete all sessions for this user
  await Session.deleteMany({ userId: user._id });

  res.json({
    status: 200,
    message: "Password has been successfully reset.",
    data: {}
  });
};

module.exports = {
  register,
  login,
  refresh,
  logout,
  sendResetEmail,
  resetPassword
}; 