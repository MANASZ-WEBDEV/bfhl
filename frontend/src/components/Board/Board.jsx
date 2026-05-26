import { DragDropContext } from '@hello-pangea/dnd';
import Column from './Column';
import { STATUS_ORDER, ALLOWED_TRANSITIONS } from '../../utils/formatTime';
import './Board.css';

/**
 * Main Kanban board — four columns, one per status.
 * Handles drag-and-drop between columns, enforcing transition rules.
 */
export default function Board({ tickets, onMoveTicket, onDeleteTicket, onInvalidDrop }) {
  // Group tickets by status
  const columns = {};
  STATUS_ORDER.forEach((s) => { columns[s] = []; });
  tickets.forEach((t) => {
    if (columns[t.status]) {
      columns[t.status].push(t);
    }
  });

  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    // Dropped outside any column
    if (!destination) return;

    // Dropped in same column, same position
    if (destination.droppableId === source.droppableId) return;

    const fromStatus = source.droppableId;
    const toStatus = destination.droppableId;

    // Check if transition is allowed
    const allowed = ALLOWED_TRANSITIONS[fromStatus] || [];
    if (!allowed.includes(toStatus)) {
      onInvalidDrop(fromStatus, toStatus);
      return;
    }

    // Valid transition — trigger the move
    onMoveTicket(draggableId, toStatus);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
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
    </DragDropContext>
  );
}
