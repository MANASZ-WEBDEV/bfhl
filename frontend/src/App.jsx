import { useState, useCallback } from 'react';
import { useTickets } from './hooks/useTickets';
import { useToast, ToastContainer } from './components/common/Toast';
import Board from './components/Board/Board';
import StatsStrip from './components/Stats/StatsStrip';
import FilterBar from './components/Filters/FilterBar';
import CreateTicketModal from './components/CreateTicket/CreateTicketModal';
import Spinner from './components/common/Spinner';
import { STATUS_LABELS } from './utils/formatTime';

export default function App() {
  const {
    tickets,
    stats,
    loading,
    error,
    filters,
    refresh,
    addTicket,
    moveTicket,
    removeTicket,
    applyFilters,
  } = useTickets();

  const { toasts, addToast, removeToast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);

  /** Handle ticket creation from the modal form */
  const handleCreate = useCallback(async (data) => {
    const ticket = await addTicket(data);
    addToast(`Ticket "${ticket.subject}" created successfully`, 'success');
  }, [addTicket, addToast]);

  /** Handle moving a ticket (from button click or drag-and-drop) */
  const handleMove = useCallback(async (ticketId, newStatus) => {
    try {
      await moveTicket(ticketId, newStatus);
      addToast(`Ticket moved to ${STATUS_LABELS[newStatus]}`, 'success', 2500);
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to move ticket';
      addToast(msg, 'error');
    }
  }, [moveTicket, addToast]);



  /** Handle ticket deletion */
  const handleDelete = useCallback(async (ticketId) => {
    try {
      await removeTicket(ticketId);
      addToast('Ticket deleted', 'info', 2500);
    } catch (err) {
      addToast('Failed to delete ticket', 'error');
    }
  }, [removeTicket, addToast]);

  return (
    <div className="app-container">
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      {/* ── Header ── */}
      <header className="app-header">
        <div className="app-logo">
          <div className="app-logo-icon">🎫</div>
          <div>
            <h1>DeskFlow</h1>
            <p className="app-logo-tagline">Support Ticket Triage Board</p>
          </div>
        </div>
        <button
          className="btn-create"
          onClick={() => setModalOpen(true)}
          id="btn-create-ticket"
        >
          <span className="btn-create-icon">+</span>
          New Ticket
        </button>
      </header>

      {/* ── Stats Strip ── */}
      <StatsStrip stats={stats} />

      {/* ── Filters ── */}
      <FilterBar filters={filters} onFilterChange={applyFilters} />

      {/* ── Main Content ── */}
      {loading ? (
        <div className="app-loading">
          <Spinner size={40} text="Loading tickets..." />
        </div>
      ) : error ? (
        <div className="app-error">
          <div className="app-error-icon">⚠️</div>
          <p className="app-error-message">{error}</p>
          <button className="btn-retry" onClick={refresh}>
            Try Again
          </button>
        </div>
      ) : (
        <Board
          tickets={tickets}
          onMoveTicket={handleMove}
          onDeleteTicket={handleDelete}
        />
      )}

      {/* ── Create Ticket Modal ── */}
      <CreateTicketModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCreate}
      />
    </div>
  );
}
