/**
 * Defines the allowed status transitions for tickets.
 *
 * Forward: open → in_progress → resolved → closed
 * Backward: only ONE step back is allowed.
 *
 * This means:
 *   open        can move to → in_progress
 *   in_progress can move to → resolved   (forward) or open        (back)
 *   resolved    can move to → closed     (forward) or in_progress (back)
 *   closed      can move to → resolved   (back)
 */
const ALLOWED_TRANSITIONS = Object.freeze({
  open:        ['in_progress'],
  in_progress: ['resolved', 'open'],
  resolved:    ['closed', 'in_progress'],
  closed:      ['resolved'],
});

/**
 * Validate whether a status transition is permitted.
 *
 * @param {string} currentStatus
 * @param {string} newStatus
 * @returns {{ valid: boolean, error?: string }}
 */
function validateTransition(currentStatus, newStatus) {
  if (currentStatus === newStatus) {
    return { valid: false, error: `Ticket is already in "${currentStatus}" status.` };
  }

  const allowed = ALLOWED_TRANSITIONS[currentStatus];
  if (!allowed || !allowed.includes(newStatus)) {
    return {
      valid: false,
      error: `Cannot transition from "${currentStatus}" to "${newStatus}". Allowed transitions: ${allowed?.join(', ') || 'none'}.`,
    };
  }

  return { valid: true };
}

module.exports = { ALLOWED_TRANSITIONS, validateTransition };
