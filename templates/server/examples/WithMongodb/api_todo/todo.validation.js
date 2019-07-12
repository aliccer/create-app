/* eslint-disable newline-per-chained-call */
const { param, body, validationResult } = require('express-validator/check');

const todoIdParam = param('id').isMongoId().withMessage('Todo ID required');
const todoIdsBody = body('ids').isMongoId().withMessage('Todo IDs required');
const todoBody = body('text').trim().not().isEmpty().withMessage('Must not be empty');

// Check if any error is cased by validation,
// if error is present sends error to response object.
const handleValidation = (req, res, next) => {
  try {
    validationResult(req).throw();
    next();
  } catch (error) {
    res.sendValidationError(error.array());
  }
};

exports.onDelete = [
  todoIdsBody,
  handleValidation,
];

exports.onUpdate = [
  todoIdParam,
  handleValidation,
];

exports.onCreate = [
  todoBody,
  handleValidation,
];
