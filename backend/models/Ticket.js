const mongoose = require('mongoose');
const { computeSLA } = require('../utils/sla');

const ticketSchema = new mongoose.Schema(
  {
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true,
      maxlength: [200, 'Subject must be 200 characters or fewer'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    customerEmail: {
      type: String,
      required: [true, 'Customer email is required'],
      trim: true,
      lowercase: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Please provide a valid email address',
      ],
    },
    priority: {
      type: String,
      required: [true, 'Priority is required'],
      enum: {
        values: ['low', 'medium', 'high', 'urgent'],
        message: 'Priority must be one of: low, medium, high, urgent',
      },
    },
    status: {
      type: String,
      enum: {
        values: ['open', 'in_progress', 'resolved', 'closed'],
        message: 'Status must be one of: open, in_progress, resolved, closed',
      },
      default: 'open',
    },
    resolvedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true, // adds createdAt + updatedAt
  }
);

/**
 * Custom toJSON transform — injects the derived `ageMinutes` and
 * `slaBreached` fields into every ticket response without storing
 * them in the database.
 */
ticketSchema.set('toJSON', {
  transform(_doc, ret) {
    const { ageMinutes, slaBreached } = computeSLA(ret);
    ret.ageMinutes = ageMinutes;
    ret.slaBreached = slaBreached;

    // Clean up Mongoose internals
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('Ticket', ticketSchema);
