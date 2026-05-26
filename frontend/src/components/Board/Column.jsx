import TicketCard from './TicketCard';
import { STATUS_LABELS } from '../../utils/formatTime';
import './Column.css';

const STATUS_ICONS = {
  open: '📬',
  in_progress: '⚡',
  resolved: '✅',
  closed: '📁',
};

export default function Column({ status, tickets, onMoveTicket, onDeleteTicket }) {
  const count = tickets.length;

  return (
    <div className={`column column--${status}`} id={`column-${status}`}>
      <div className="column-header">
        <div className="column-header-left">
          <span className="column-icon">{STATUS_ICONS[status]}</span>
          <h2 className="column-title">{STATUS_LABELS[status]}</h2>
        </div>
        <span className="column-count">{count}</span>
      </div>

      <div className="column-body">
        {tickets.length === 0 && (
          <div className="column-empty">
            <span className="column-empty-icon">🫧</span>
            <p>No tickets</p>
          </div>
        )}

        {tickets.map((ticket) => (
          <TicketCard
            key={ticket._id}
            ticket={ticket}
            onMove={onMoveTicket}
            onDelete={onDeleteTicket}
          />
        ))}
      </div>
    </div>
  );
}
