const Joi = require('joi');
const createError = require('http-errors');

const validateBody = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      next(createError(400, error.message));
    }
    next();
  };
};

const resetPasswordSchema = Joi.object({
  token: Joi.string().required(),
  password: Joi.string().min(6).required()
});

module.exports = {
  validateBody,
  resetPasswordSchema
};
