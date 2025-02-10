const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const User = require('../models/user');

const authenticate = async (req, res, next) => {
  try {
    const { authorization = "" } = req.headers;
    const [bearer, token] = authorization.split(" ");

    if (bearer !== "Bearer" || !token) {
      throw createError(401, "Not authorized");
    }

    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(id);

    if (!user || !user.token || user.token !== token) {
      throw createError(401, "Not authorized");
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      next(createError(401, "Not authorized"));
    }
    next(error);
  }
};

module.exports = authenticate;
