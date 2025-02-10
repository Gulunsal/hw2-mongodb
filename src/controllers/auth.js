const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const { User } = require('../models/user');
const { sendResetPasswordEmail } = require('../helpers/emailService');

// ... mevcut fonksiyonlar ...

const sendResetEmail = async (req, res) => {
  const { email } = req.body;
  
  const user = await User.findOne({ email });
  if (!user) {
    throw createError(404, "User not found!");
  }

  const resetToken = jwt.sign(
    { email },
    process.env.JWT_SECRET,
    { expiresIn: '5m' }
  );

  const resetLink = `${process.env.APP_DOMAIN}/reset-password?token=${resetToken}`;
  
  try {
    await sendResetPasswordEmail(email, resetLink);
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
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ email: decoded.email });
    
    if (!user) {
      throw createError(404, "User not found!");
    }

    user.password = password;
    await user.save();

    // Kullanıcının mevcut oturumunu sonlandır
    user.token = null;
    await user.save();

    res.json({
      status: 200,
      message: "Password has been successfully reset.",
      data: {}
    });
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      throw createError(401, "Token is expired or invalid.");
    }
    throw error;
  }
};

module.exports = {
  // ... mevcut exports ...
  sendResetEmail,
  resetPassword
}; 