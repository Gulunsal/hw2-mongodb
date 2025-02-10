const createError = require('http-errors');
const { verifyToken } = require('../helpers/jwt');
const { User } = require('../models/user');

const authenticate = async (req, res, next) => {
  try {
    const { authorization = '' } = req.headers;
    const [bearer, token] = authorization.split(' ');

    if (bearer !== 'Bearer') {
      throw createError(401, 'Not authorized');
    }

    const { userId } = verifyToken(token);
    if (!userId) {
      throw createError(401, 'Access token expired');
    }

    const user = await User.findById(userId);
    if (!user) {
      throw createError(401, 'Not authorized');
    }

    req.user = user;
    next();
  } catch (error) {
    next(createError(401, error.message));
  }
};

module.exports = authenticate;