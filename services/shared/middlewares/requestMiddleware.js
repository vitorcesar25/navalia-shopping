const {validationResult, checkSchema} = require("express-validator");

/**
 * Middleware to validate request parameters, query, body, and headers.
 *
 * @param {Object} schema - Validation schema using express-validator.
 * @return {Function[]} Array of middleware functions.
 */
const validate = (schema) => {
  const validations = checkSchema(schema);
  return [
    ...validations,
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
      }
      next();
    },
  ];
};

module.exports = validate;
