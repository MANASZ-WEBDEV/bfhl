/**
 * Format a duration in minutes into a human-readable string.
 *
 * Examples:
 *   0     → "just now"
 *   3     → "3m"
 *   72    → "1h 12m"
 *   1500  → "1d 1h"
 *   4320  → "3d 0h"
 */
export function formatAge(minutes) {
  if (minutes < 1) return 'just now';

  const days = Math.floor(minutes / 1440);
  const hours = Math.floor((minutes % 1440) / 60);
  const mins = minutes % 60;

  if (days > 0) {
    return `${days}d ${hours}h`;
  }
  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  return `${mins}m`;
}

/**
 * Map a status key to its display label.
 */
export const STATUS_LABELS = {
  open: 'Open',
  in_progress: 'In Progress',
  resolved: 'Resolved',
  closed: 'Closed',
};

/**
 * Map a priority key to its display label.
 */
export const PRIORITY_LABELS = {
  urgent: 'Urgent',
  high: 'High',
  medium: 'Medium',
  low: 'Low',
};

/**
 * The allowed transitions for each status (mirrors backend logic).
 * Used to determine which move buttons to show on the UI.
 */
export const ALLOWED_TRANSITIONS = {
  open: ['in_progress'],
  in_progress: ['resolved', 'open'],
  resolved: ['closed', 'in_progress'],
  closed: ['resolved'],
};

/**
 * The ordered list of statuses for the board columns.
 */
export const STATUS_ORDER = ['open', 'in_progress', 'resolved', 'closed'];
