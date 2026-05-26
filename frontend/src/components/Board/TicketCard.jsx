import Badge from '../common/Badge';
import { formatAge, ALLOWED_TRANSITIONS, STATUS_LABELS } from '../../utils/formatTime';
import './TicketCard.css';

/**
 * Individual ticket card — shown inside a board column.
 * Displays subject, priority badge, age, SLA breach indicator,
 * and buttons to move to adjacent statuses.
 */
export default function TicketCard({ ticket, onMove, onDelete, isDragging }) {
  const transitions = ALLOWED_TRANSITIONS[ticket.status] || [];

  const handleMove = async (newStatus) => {
    onMove(ticket._id, newStatus);
  };

  return (
    <div
      className={`ticket-card ${ticket.slaBreached ? 'ticket-card--breached' : ''} ${isDragging ? 'ticket-card--dragging' : ''}`}
      id={`ticket-${ticket._id}`}
    >
      {/* Header: Subject + delete */}
      <div className="ticket-card-header">
        <h3 className="ticket-card-subject">{ticket.subject}</h3>
        <button
          className="ticket-card-delete"
          onClick={() => onDelete(ticket._id)}
          title="Delete ticket"
          aria-label="Delete ticket"
        >
          ×
        </button>
      </div>

      {/* Meta row: priority badge + age + breach indicator */}
      <div className="ticket-card-meta">
        <Badge priority={ticket.priority} />
        <span className="ticket-card-age" title={`Created: ${new Date(ticket.createdAt).toLocaleString()}`}>
          🕐 {formatAge(ticket.ageMinutes)}
        </span>
        {ticket.slaBreached && (
          <span className="ticket-card-breach" title="SLA target exceeded">
            ⚠ SLA
          </span>
        )}
      </div>

      {/* Email */}
      <p className="ticket-card-email">{ticket.customerEmail}</p>

      {/* Transition buttons */}
      {transitions.length > 0 && (
        <div className="ticket-card-actions">
          {transitions.map((status) => {
            // Determine if this is a "forward" or "backward" move
            const isForward = getDirection(ticket.status, status) === 'forward';
            return (
              <button
                key={status}
                className={`ticket-action-btn ${isForward ? 'ticket-action-btn--forward' : 'ticket-action-btn--back'}`}
                onClick={() => handleMove(status)}
                title={`Move to ${STATUS_LABELS[status]}`}
              >
                {isForward ? '→' : '←'} {STATUS_LABELS[status]}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/** Determine move direction based on status order */
function getDirection(from, to) {
  const order = ['open', 'in_progress', 'resolved', 'closed'];
  return order.indexOf(to) > order.indexOf(from) ? 'forward' : 'backward';
}
