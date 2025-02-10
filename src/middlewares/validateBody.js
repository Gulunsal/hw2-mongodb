const createError = require('http-errors');

const validateBody = schema => {
  const func = async (req, res, next) => {
    try {
      const { error } = schema.validate(req.body);
      if (error) {
        throw createError(400, error.details[0].message);
      }
      next();
    } catch (error) {
      next(error);
    }
  };
  return func;
};

module.exports = validateBody; 