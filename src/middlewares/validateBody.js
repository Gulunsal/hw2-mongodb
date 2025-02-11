const createError = require('http-errors');

const validateBody = schema => {
  return async (req, res, next) => {
    try {
      const { error } = schema.validate(req.body);
      
      if (error) {
        throw createError(400, error.message);
      }
      
      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = validateBody; 