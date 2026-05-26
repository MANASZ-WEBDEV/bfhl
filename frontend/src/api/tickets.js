import axios from 'axios';

/**
 * Axios instance configured to talk to the DeskFlow API.
 *
 * In development, Vite's proxy rewrites /tickets → http://localhost:5000/tickets.
 * In production, set VITE_API_URL to the deployed backend URL.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

export async function fetchTickets(filters = {}) {
  const params = {};
  if (filters.status) params.status = filters.status;
  if (filters.priority) params.priority = filters.priority;
  if (filters.breached) params.breached = 'true';
  const { data } = await api.get('/tickets', { params });
  return data;
}

export async function createTicket(ticketData) {
  const { data } = await api.post('/tickets', ticketData);
  return data;
}

export async function updateTicket(id, updates) {
  const { data } = await api.patch(`/tickets/${id}`, updates);
  return data;
}

export async function deleteTicket(id) {
  await api.delete(`/tickets/${id}`);
}

export async function fetchStats() {
  const { data } = await api.get('/tickets/stats');
  return data;
}
