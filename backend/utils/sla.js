/**
 * SLA target times in minutes, keyed by priority level.
 * These define the maximum acceptable response time before
 * a ticket is considered to be breaching its SLA.
 */
const SLA_TARGETS = Object.freeze({
  urgent: 60,       // 1 hour
  high:   240,      // 4 hours
  medium: 1440,     // 24 hours
  low:    4320,     // 72 hours
});

/**
 * Compute derived SLA fields for a ticket document.
 *
 * @param {Object} ticket — A plain ticket object (or Mongoose doc)
 * @returns {{ ageMinutes: number, slaBreached: boolean }}
 */
function computeSLA(ticket) {
  const created = new Date(ticket.createdAt).getTime();

  // If the ticket has been resolved, age is frozen at resolution time.
  // Otherwise it keeps growing relative to "now".
  const end = ticket.resolvedAt
    ? new Date(ticket.resolvedAt).getTime()
    : Date.now();

  const ageMinutes = Math.floor((end - created) / 60000);
  const target = SLA_TARGETS[ticket.priority];

  // A ticket breaches SLA if its age exceeds the target —
  // regardless of whether it's still open or was resolved late.
  const slaBreached = ageMinutes > target;

  return { ageMinutes, slaBreached };
}

module.exports = { SLA_TARGETS, computeSLA };
