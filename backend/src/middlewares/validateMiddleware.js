const { error } = require('../utils/apiResponse');

/**
 * Factory that returns Express middleware to validate req.body against a Joi schema.
 * @param {import('joi').ObjectSchema} schema  Joi schema to validate against
 * @param {'body'|'query'|'params'} source    Part of the request to validate
 */
const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    const { error: validationError, value } = schema.validate(req[source], {
      abortEarly: false,
      stripUnknown: true,
    });

    if (validationError) {
      const messages = validationError.details.map((d) => d.message);
      return error(res, 'Validation failed', 422, messages);
    }

    req[source] = value; // Replace with sanitised/cast values
    next();
  };
};

module.exports = validate;
