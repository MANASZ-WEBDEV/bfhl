import Column from './Column';
import { STATUS_ORDER } from '../../utils/formatTime';
import './Board.css';

/**
 * Main Kanban board — four columns, one per status.
 * Standard layout using direct column rendering.
 */
export default function Board({ tickets, onMoveTicket, onDeleteTicket }) {
  // Group tickets by status
  const columns = {};
  STATUS_ORDER.forEach((s) => { columns[s] = []; });
  tickets.forEach((t) => {
    if (columns[t.status]) {
      columns[t.status].push(t);
    }
  });

  return (
    <div className="board" id="board">
      {STATUS_ORDER.map((status) => (
        <Column
          key={status}
          status={status}
          tickets={columns[status]}
          onMoveTicket={onMoveTicket}
          onDeleteTicket={onDeleteTicket}
        />
      ))}
    </div>
  );
}
