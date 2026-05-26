/**
 * Centralized error-handling middleware.
 * Catches any errors thrown or passed via next(err) in route handlers.
 */
// eslint-disable-next-line no-unused-vars
function errorHandler(err, _req, res, _next) {
  console.error(`[Error] ${err.message}`);

  // Mongoose validation errors → 400 with field-level messages
  if (err.name === 'ValidationError') {
    const errors = Object.entries(err.errors).map(([field, e]) => ({
      field,
      message: e.message,
    }));
    return res.status(400).json({ error: 'Validation failed', errors });
  }

  // Mongoose cast errors (e.g. invalid ObjectId) → 400
  if (err.name === 'CastError') {
    return res.status(400).json({ error: `Invalid ${err.path}: ${err.value}` });
  }

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: err.message || 'Internal server error',
  });
}

module.exports = errorHandler;
