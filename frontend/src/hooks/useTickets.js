import { useState, useEffect, useCallback, useRef } from 'react';
import * as api from '../api/tickets';

/**
 * Central state management hook for all ticket operations.
 * Handles fetching, creating, updating, deleting, and filtering.
 */
export function useTickets() {
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ priority: '', breached: false });

  // Track if we've done the initial load
  const initialLoad = useRef(true);

  /** Fetch tickets from the API with current filters */
  const loadTickets = useCallback(async (currentFilters) => {
    try {
      const f = currentFilters || filters;
      const params = {};
      if (f.priority) params.priority = f.priority;
      if (f.breached) params.breached = true;
      const data = await api.fetchTickets(params);
      setTickets(data);
      setError(null);
    } catch (err) {
      const msg = err.response?.data?.error || err.message || 'Failed to load tickets';
      setError(msg);
    }
  }, [filters]);

  /** Fetch aggregate stats */
  const loadStats = useCallback(async () => {
    try {
      const data = await api.fetchStats();
      setStats(data);
    } catch {
      // Stats are non-critical; silently fail
    }
  }, []);

  /** Initial data load + reload when filters change */
  useEffect(() => {
    const load = async () => {
      if (initialLoad.current) {
        setLoading(true);
        initialLoad.current = false;
      }
      await Promise.all([loadTickets(filters), loadStats()]);
      setLoading(false);
    };
    load();
  }, [filters, loadTickets, loadStats]);

  /** Refresh everything (tickets + stats) */
  const refresh = useCallback(async () => {
    await Promise.all([loadTickets(filters), loadStats()]);
  }, [filters, loadTickets, loadStats]);

  /** Create a new ticket */
  const addTicket = useCallback(async (ticketData) => {
    const newTicket = await api.createTicket(ticketData);
    // Prepend to list and refresh stats
    setTickets((prev) => [newTicket, ...prev]);
    loadStats();
    return newTicket;
  }, [loadStats]);

  /** Move a ticket to a new status */
  const moveTicket = useCallback(async (ticketId, newStatus) => {
    const updated = await api.updateTicket(ticketId, { status: newStatus });
    setTickets((prev) =>
      prev.map((t) => (t._id === ticketId ? updated : t))
    );
    loadStats();
    return updated;
  }, [loadStats]);

  /** Delete a ticket */
  const removeTicket = useCallback(async (ticketId) => {
    await api.deleteTicket(ticketId);
    setTickets((prev) => prev.filter((t) => t._id !== ticketId));
    loadStats();
  }, [loadStats]);

  /** Update filters (triggers re-fetch via useEffect) */
  const applyFilters = useCallback((newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  return {
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
  };
}
