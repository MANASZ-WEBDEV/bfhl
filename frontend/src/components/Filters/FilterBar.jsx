import './FilterBar.css';

const PRIORITIES = [
  { value: '', label: 'All Priorities' },
  { value: 'urgent', label: '🔴 Urgent' },
  { value: 'high', label: '🟠 High' },
  { value: 'medium', label: '🔵 Medium' },
  { value: 'low', label: '⚪ Low' },
];

export default function FilterBar({ filters, onFilterChange }) {
  return (
    <div className="filter-bar" id="filter-bar">
      <div className="filter-bar-group">
        <label className="filter-label" htmlFor="filter-priority">
          Priority
        </label>
        <select
          id="filter-priority"
          className="filter-select"
          value={filters.priority}
          onChange={(e) => onFilterChange({ priority: e.target.value })}
        >
          {PRIORITIES.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-bar-group">
        <label className="filter-toggle-label" htmlFor="filter-breached">
          <div
            className={`filter-toggle ${filters.breached ? 'filter-toggle--active' : ''}`}
            role="switch"
            aria-checked={filters.breached}
            tabIndex={0}
            onClick={() => onFilterChange({ breached: !filters.breached })}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onFilterChange({ breached: !filters.breached });
              }
            }}
          >
            <div className="filter-toggle-thumb" />
          </div>
          <span className="filter-toggle-text">
            SLA Breached Only
          </span>
          {filters.breached && <span className="filter-active-dot" />}
        </label>
      </div>

      {(filters.priority || filters.breached) && (
        <button
          className="filter-clear"
          onClick={() => onFilterChange({ priority: '', breached: false })}
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
