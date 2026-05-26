const Ticket = require('../models/Ticket');
const { validateTransition } = require('../utils/transitions');
const { computeSLA, SLA_TARGETS } = require('../utils/sla');

/**
 * POST /tickets
 * Create a new ticket. Status defaults to "open".
 */
async function createTicket(req, res, next) {
  try {
    const { subject, description, customerEmail, priority } = req.body;

    const ticket = await Ticket.create({
      subject,
      description,
      customerEmail,
      priority,
      // status defaults to 'open' via schema
    });

    res.status(201).json(ticket.toJSON());
  } catch (err) {
    next(err);
  }
}

/**
 * GET /tickets
 * List tickets with optional filters: ?status, ?priority, ?breached=true
 *
 * The `breached` filter can't be done in the DB query because slaBreached
 * is a derived field — so we fetch, transform, then filter in memory.
 */
async function listTickets(req, res, next) {
  try {
    const { status, priority, breached } = req.query;

    // Build the Mongo query from filters that map to stored fields
    const query = {};
    if (status) query.status = status;
    if (priority) query.priority = priority;

    const tickets = await Ticket.find(query).sort({ createdAt: -1 });

    // Convert to JSON (which injects derived fields) then optionally
    // filter by the computed `slaBreached` flag.
    let result = tickets.map((t) => t.toJSON());

    if (breached === 'true') {
      result = result.filter((t) => t.slaBreached === true);
    }

    res.json(result);
  } catch (err) {
    next(err);
  }
}

/**
 * PATCH /tickets/:id
 * Update a ticket. Enforces status transition rules, and automatically
 * manages the resolvedAt timestamp.
 */
async function updateTicket(req, res, next) {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    const { status, subject, description, customerEmail, priority } = req.body;

    // If a status change is requested, validate the transition
    if (status && status !== ticket.status) {
      const { valid, error } = validateTransition(ticket.status, status);
      if (!valid) {
        return res.status(400).json({ error });
      }

      ticket.status = status;

      // Auto-manage resolvedAt based on the new status
      if (status === 'resolved') {
        ticket.resolvedAt = new Date();
      } else if (ticket.resolvedAt && status !== 'closed') {
        // Moving away from resolved (back to in_progress or open) clears it
        ticket.resolvedAt = null;
      }
    }

    // Allow updating other fields too
    if (subject !== undefined) ticket.subject = subject;
    if (description !== undefined) ticket.description = description;
    if (customerEmail !== undefined) ticket.customerEmail = customerEmail;
    if (priority !== undefined) ticket.priority = priority;

    await ticket.save();
    res.json(ticket.toJSON());
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /tickets/:id
 * Permanently remove a ticket.
 */
async function deleteTicket(req, res, next) {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    await ticket.deleteOne();
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

/**
 * GET /tickets/stats
 * Aggregate counts:
 *   - tickets per status
 *   - tickets per priority
 *   - SLA-breached tickets that are still open or in_progress
 */
async function getStats(req, res, next) {
  try {
    // Run both aggregations in parallel for speed
    const [statusCounts, priorityCounts, allUnresolved] = await Promise.all([
      Ticket.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      Ticket.aggregate([
        { $group: { _id: '$priority', count: { $sum: 1 } } },
      ]),
      // Fetch unresolved tickets to compute breaches in-memory
      Ticket.find({ status: { $in: ['open', 'in_progress'] } }).lean(),
    ]);

    // Normalize status counts into a keyed object
    const byStatus = { open: 0, in_progress: 0, resolved: 0, closed: 0 };
    statusCounts.forEach(({ _id, count }) => {
      byStatus[_id] = count;
    });

    // Normalize priority counts
    const byPriority = { low: 0, medium: 0, high: 0, urgent: 0 };
    priorityCounts.forEach(({ _id, count }) => {
      byPriority[_id] = count;
    });

    // Count SLA breaches among open/in_progress tickets
    const breachedCount = allUnresolved.filter((t) => {
      const { slaBreached } = computeSLA(t);
      return slaBreached;
    }).length;

    res.json({
      byStatus,
      byPriority,
      breachedOpen: breachedCount,
      total: Object.values(byStatus).reduce((a, b) => a + b, 0),
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createTicket,
  listTickets,
  updateTicket,
  deleteTicket,
  getStats,
};
