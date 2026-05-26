const { body, param, query, validationResult } = require('express-validator');

/**
 * Collect validation errors and return a structured 400 response,
 * or call next() if everything checks out.
 */
function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formatted = errors.array().map((e) => ({
      field: e.path,
      message: e.msg,
    }));
    return res.status(400).json({ error: 'Validation failed', errors: formatted });
  }
  next();
}

/** Rules for POST /tickets */
const createTicketRules = [
  body('subject')
    .trim()
    .notEmpty().withMessage('Subject is required')
    .isLength({ max: 200 }).withMessage('Subject must be 200 characters or fewer'),

  body('description')
    .trim()
    .notEmpty().withMessage('Description is required'),

  body('customerEmail')
    .trim()
    .notEmpty().withMessage('Customer email is required')
    .isEmail().withMessage('Please provide a valid email address'),

  body('priority')
    .trim()
    .notEmpty().withMessage('Priority is required')
    .isIn(['low', 'medium', 'high', 'urgent'])
    .withMessage('Priority must be one of: low, medium, high, urgent'),

  // Clients should NOT set status on creation — it defaults to "open"
  body('status')
    .optional()
    .isIn(['open'])
    .withMessage('New tickets must start with status "open"'),

  handleValidationErrors,
];

/** Rules for PATCH /tickets/:id */
const updateTicketRules = [
  param('id')
    .isMongoId().withMessage('Invalid ticket ID format'),

  body('subject')
    .optional()
    .trim()
    .notEmpty().withMessage('Subject cannot be empty')
    .isLength({ max: 200 }).withMessage('Subject must be 200 characters or fewer'),

  body('description')
    .optional()
    .trim()
    .notEmpty().withMessage('Description cannot be empty'),

  body('customerEmail')
    .optional()
    .trim()
    .isEmail().withMessage('Please provide a valid email address'),

  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'urgent'])
    .withMessage('Priority must be one of: low, medium, high, urgent'),

  body('status')
    .optional()
    .isIn(['open', 'in_progress', 'resolved', 'closed'])
    .withMessage('Status must be one of: open, in_progress, resolved, closed'),

  handleValidationErrors,
];

/** Rules for DELETE /tickets/:id */
const deleteTicketRules = [
  param('id')
    .isMongoId().withMessage('Invalid ticket ID format'),
  handleValidationErrors,
];

/** Rules for GET /tickets query filters */
const listTicketRules = [
  query('status')
    .optional()
    .isIn(['open', 'in_progress', 'resolved', 'closed'])
    .withMessage('Status filter must be one of: open, in_progress, resolved, closed'),

  query('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'urgent'])
    .withMessage('Priority filter must be one of: low, medium, high, urgent'),

  query('breached')
    .optional()
    .isIn(['true', 'false'])
    .withMessage('Breached filter must be "true" or "false"'),

  handleValidationErrors,
];

module.exports = {
  createTicketRules,
  updateTicketRules,
  deleteTicketRules,
  listTicketRules,
};
