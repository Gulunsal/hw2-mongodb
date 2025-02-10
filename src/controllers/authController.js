const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const createError = require('http-errors');
const User = require('../models/user');
const { sendResetPasswordEmail } = require('../helpers/emailHelper');

const register = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Register attempt for email:', email);

    const user = await User.findOne({ email });
    if (user) {
      console.log('Email already exists:', email);
      throw createError(409, "Email already in use");
    }

    const newUser = await User.create({ email, password });
    console.log('User created successfully:', newUser.email);

    res.status(201).json({
      status: 201,
      message: "Registration successful",
      data: {
        user: {
          email: newUser.email,
          subscription: newUser.subscription
        }
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    throw error;
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    throw createError(401, "Email or password is wrong");
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    throw createError(401, "Email or password is wrong");
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
  await User.findByIdAndUpdate(user._id, { token });

  res.json({
    status: 200,
    message: "Login successful",
    data: {
      token,
      user: {
        email: user.email,
        subscription: user.subscription
      }
    }
  });
};

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
  try {
    const { token, password } = req.body;

    // Token'ı doğrula
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      throw createError(401, "Token is expired or invalid.");
    }

    // Kullanıcıyı bul
    const user = await User.findOne({ email: decoded.email });
    if (!user) {
      throw createError(404, "User not found!");
    }

    // Şifreyi güncelle
    user.password = password;
    user.token = null; // Mevcut oturumu sil
    await user.save();

    res.json({
      status: 200,
      message: "Password has been successfully reset.",
      data: {}
    });

  } catch (error) {
    if (!error.status) {
      error.status = 500;
    }
    throw error;
  }
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: null });

  res.status(204).json({
    status: 204,
    message: "Logout successful",
    data: {}
  });
};

const getCurrent = async (req, res) => {
  const { email, subscription } = req.user;

  res.json({
    status: 200,
    message: "Success",
    data: {
      user: {
        email,
        subscription
      }
    }
  });
};

module.exports = {
  register,
  login,
  logout,
  getCurrent,
  sendResetEmail,
  resetPassword
};
