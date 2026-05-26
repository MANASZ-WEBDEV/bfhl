import { Droppable, Draggable } from '@hello-pangea/dnd';
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

      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`column-body ${snapshot.isDraggingOver ? 'column-body--drag-over' : ''}`}
          >
            {tickets.length === 0 && !snapshot.isDraggingOver && (
              <div className="column-empty">
                <span className="column-empty-icon">🫧</span>
                <p>No tickets</p>
              </div>
            )}

            {tickets.map((ticket, index) => (
              <Draggable key={ticket._id} draggableId={ticket._id} index={index}>
                {(dragProvided, dragSnapshot) => (
                  <div
                    ref={dragProvided.innerRef}
                    {...dragProvided.draggableProps}
                    {...dragProvided.dragHandleProps}
                  >
                    <TicketCard
                      ticket={ticket}
                      onMove={onMoveTicket}
                      onDelete={onDeleteTicket}
                      isDragging={dragSnapshot.isDragging}
                    />
                  </div>
                )}
              </Draggable>
            ))}

            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}
