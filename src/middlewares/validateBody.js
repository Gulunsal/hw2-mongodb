const createError = require('http-errors');

const validateBody = schema => {
  return async (req, res, next) => {
    try {
      await schema.validateAsync(req.body);
      next();
    } catch (error) {
      next(createError(400, error.message));
    }
  };
};

module.exports = {
  validateBody
};
