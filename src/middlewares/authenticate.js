const jwt = require('jsonwebtoken');
const User = require('../models/user');
const createError = require('http-errors');

const authenticate = async (req, res, next) => {
  try {
    // Bearer token'ı al
    const { authorization = "" } = req.headers;
    const [bearer, token] = authorization.split(" ");

    // Token formatını kontrol et
    if (bearer !== "Bearer") {
      throw createError(401, "Not authorized");
    }

    // Token'ı doğrula
    if (!token) {
      throw createError(401, "Not authorized");
    }

    // Token'ı verify et
    const { userId } = jwt.verify(token, process.env.JWT_SECRET);

    // Kullanıcıyı bul
    const user = await User.findById(userId);
    if (!user) {
      throw createError(401, "Not authorized");
    }

    // Kullanıcıyı request'e ekle
    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError" || error.name === "JsonWebTokenError") {
      next(createError(401, "Token is invalid or expired"));
    }
    next(error);
  }
};

module.exports = authenticate;