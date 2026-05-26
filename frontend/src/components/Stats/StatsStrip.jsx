import './StatsStrip.css';

const STATUS_CONFIG = [
  { key: 'open',        label: 'Open',        icon: '📬' },
  { key: 'in_progress', label: 'In Progress', icon: '⚡' },
  { key: 'resolved',    label: 'Resolved',    icon: '✅' },
  { key: 'closed',      label: 'Closed',      icon: '📁' },
];

export default function StatsStrip({ stats }) {
  if (!stats) return null;

  return (
    <div className="stats-strip" id="stats-strip">
      <div className="stats-strip-items">
        {STATUS_CONFIG.map(({ key, label, icon }) => (
          <div key={key} className={`stats-item stats-item--${key}`}>
            <span className="stats-item-icon">{icon}</span>
            <div className="stats-item-info">
              <span className="stats-item-count">{stats.byStatus[key] || 0}</span>
              <span className="stats-item-label">{label}</span>
            </div>
          </div>
        ))}

        <div className="stats-divider" />

        <div className="stats-item stats-item--breached">
          <span className="stats-item-icon">🔴</span>
          <div className="stats-item-info">
            <span className="stats-item-count stats-item-count--breach">
              {stats.breachedOpen || 0}
            </span>
            <span className="stats-item-label">SLA Breached</span>
          </div>
        </div>

        <div className="stats-item stats-item--total">
          <span className="stats-item-icon">📊</span>
          <div className="stats-item-info">
            <span className="stats-item-count">{stats.total || 0}</span>
            <span className="stats-item-label">Total</span>
          </div>
        </div>
      </div>
    </div>
  );
}
